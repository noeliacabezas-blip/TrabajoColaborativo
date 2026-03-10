const express = require("express");
const router = express.Router();
const profesorControlador = require("../controladores/profesor_controlador");

router.get("/", profesorControlador.obtenerProfesores);

module.exports = router;