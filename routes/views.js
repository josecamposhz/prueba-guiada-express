const { Router } = require("express");
const db = require("../db.js");
const requiresAuth = require("../middlewares/requiresAuth");

const router = Router();

router.get("/", (req, res) => {
    res.render("Home");
});

router.get("/login", (req, res) => {
    res.render("Login");
});

router.get("/evidencias", requiresAuth, (req, res) => {
    res.render("Evidencias");
});

router.get("/admin", requiresAuth, async (req, res) => {
    console.log(req.user)
    const usuarios = await db.getUsuarios();
    res.render("Admin", { usuarios, user: req.user }); // tip para el perfil
});

module.exports = router;