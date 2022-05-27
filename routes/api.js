const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const db = require("../db.js");
const sendEmail = require("../correo");

// apiRouter solo es el nombre del enrutador en el archivo actual
const apiRouter = Router();

// prefijo /api/v1
apiRouter.get("/usuarios", async (req, res) => { // api/v1/usuarios
    const usuarios = await db.getUsuarios();
    res.send(usuarios);
});

apiRouter.put("/usuarios", async (req, res) => { // api/v1/usuarios
    const { id, auth } = req.body;
    const usuario = await db.setUsuarioStatus(id, auth);
    await sendEmail(usuario, false);
    res.send(usuario.auth);
});

// api/v1/register
apiRouter.post("/register", async (req, res) => {
    try {
        const { email, nombre, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const usuario = await db.nuevoUsuario(email, nombre, hashedPassword);
        await sendEmail(usuario);
        res.status(201).send(usuario);
    } catch (error) {
        res.status(500).send(error);
    }
});

apiRouter.post("/login", async (req, res) => {
    let { email, password } = req.body;
    let user = await db.getUsuarioByEmail(email);
    // verificamos que el usuario está en la bd
    if (!user) {
        return res.status(404).send({
            error: "Este usuario no está registrado en la base de datos",
            code: 404,
        });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword === false) {
        return res.status(401).send({ error: "Credenciales inválidas", code: 401 });
    }

    if (!user.auth) {
        return res.status(401).send({
            error: "Este usuario aún no está habilitado para subir imagenes",
            code: 401,
        });
    }

    const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 });
    res.send({ user, token });
})

apiRouter.post("/upload", (req, res) => {
    console.log(req.files)
    if (!req.files || !req.files.foto) {
        return res.status(500).send("La foto es requerida");
    }
    const { foto } = req.files;
    const { name } = foto;
    foto.mv(path.join(__dirname, "..", "/public/uploads/", name), (err) => {
        if (err) throw err;
        res.send("Foto cargada con éxito");
    });
});

module.exports = apiRouter;