const express = require("express");
const router = express.Router();

const comentarioControlador = require("../controladores/comentario_controlador");
const { estaLogueado } = require("../middleware/usuarios_middelware");

router.get("/curso/:cursoId", comentarioControlador.obtenerComentariosPorCurso);
router.post("/", estaLogueado, comentarioControlador.crearComentario);


module.exports = router;