const express = require("express");
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor encendido: http://localhost:${PORT}`));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(
  expressFileUpload({
    limits: 5_000_000,
    abortOnLimit: true,
    responseOnLimit: "El tamaño de la imagen supera el límite permitido (5MB)",
    createParentPath: true,
  })
);

app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"));
app.engine(
  "hbs",
  exphbs.engine({
    extname: '.hbs',
    defaultLayout: "main",
    layoutsDir: (__dirname + "/views/layouts"),
    partialsDir: (__dirname + "/views/components"),
  })
);
app.set("view engine", "hbs");

// Vistas
app.use("/", require("./routes/views"));

// API REST
app.use("/api/v1", require("./routes/api"));



// app.get("*", (req, res) => {
//   res.redirect("/");
// });