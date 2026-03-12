require('dotenv').config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);

const Curso = require("../modelos/curso_esquema");
const Profesor = require("../modelos/profesor_esquema");

const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI + ' --> cadena conexion');

async function cargarDatos() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB");

    const profesoresJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "lista_profesores.json"), "utf8")
    );

    const cursosJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "lista_cursos.json"), "utf8")
    );

    // Limpieza inicial opcional
    await Curso.deleteMany({});
    await Profesor.deleteMany({});

    // Insertar profesores
    const profesoresInsertados = await Profesor.insertMany(profesoresJson);
    console.log(`Profesores insertados: ${profesoresInsertados.length}`);

    // Crear mapa email -> _id
    const mapaProfesores = new Map();
    profesoresInsertados.forEach((prof) => {
      mapaProfesores.set(prof.email, prof._id);
    });

    // Adaptar cursos para usar profesorId
    const cursosPreparados = cursosJson.map((curso) => {
      const profesorId = mapaProfesores.get(curso.emailProfesor);

      if (!profesorId) {
        throw new Error(
          `No se encontró profesor para el email ${curso.emailProfesor}`
        );
      }

      return {
        titulo: curso.titulo,
        categoria: curso.categoria,
        nivel: curso.nivel,
        duracion: curso.duracion,
        descripcion: curso.descripcion,
        imagen: curso.imagen,
        profesorId: profesorId,
        temario: curso.temario
      };
    });

    const cursosInsertados = await Curso.insertMany(cursosPreparados);
    console.log(`Cursos insertados: ${cursosInsertados.length}`);

    await mongoose.disconnect();
    console.log("Carga finalizada");
  } catch (error) {
    console.error("Error al cargar datos:", error.message);
    await mongoose.disconnect();
  }
}

cargarDatos();
