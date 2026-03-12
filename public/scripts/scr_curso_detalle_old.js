$(document).ready(function () {

    function obtenerIdCurso() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }

	

    function cargarCurso() {
        const idCurso = obtenerIdCurso();

        if (!idCurso) {
            $("#curso_detalle").html('<p class="text-center text-danger">No se ha indicado ningún curso.</p>');
            return;
        }

        $.getJSON(`/api/cursos/${idCurso}`, function (curso) {
            $("#curso-imagen")
                .attr("src", curso.imagen)
                .attr("alt", curso.titulo)
                .attr("title", curso.titulo);

            $("#curso-titulo").text(curso.titulo);
            $("#curso-subtitulo").text(`Curso de nivel ${curso.nivel}`);
            $("#curso-categoria").text(curso.categoria);
            $("#curso-nivel").text(curso.nivel);
            $("#curso-duracion").text(curso.duracion);

            $("#curso-profesor").text(
                curso.profesorId ? curso.profesorId.nombre : "Profesor no disponible"
            );

            $("#curso-especialidad").text(
                curso.profesorId ? curso.profesorId.especialidad : "No disponible"
            );

            $("#curso-descripcion").empty();

            if (curso.descripcion) {
                const parrafos = curso.descripcion.split("\n");
                parrafos.forEach(function (texto) {
                    if (texto.trim() !== "") {
                        $("#curso-descripcion").append(`<p class="card-text">${texto}</p>`);
                    }
                });
            }

            $("#curso-temario").empty();

            if (Array.isArray(curso.temario) && curso.temario.length > 0) {
                curso.temario.forEach(function (tema) {
                    $("#curso-temario").append(`<li>${tema}</li>`);
                });
            } else {
                $("#curso-temario").append("<li>Temario no disponible</li>");
            }

            document.title = `Formación Global Online | ${curso.titulo}`;
        }).fail(function (xhr) {
            let mensaje = "No se pudo cargar el curso.";

            if (xhr.status === 404) {
                mensaje = "El curso no existe.";
            }

            $("#curso_detalle").html(`<p class="text-center text-danger">${mensaje}</p>`);
        });
    }

	function comprobarSesion() {
        $.getJSON("/api/usuario/estado", function (respuesta) {
            if (respuesta.autenticado) {
                $("#bloque-formulario-comentario").show();
                $("#estado-comentarios").html(
                    `<div class="alert alert-info">Has iniciado sesión como <strong>${respuesta.usuario.nombre}</strong>.</div>`
                );
            } else {
                $("#bloque-formulario-comentario").hide();
                $("#estado-comentarios").html(
                    '<div class="alert alert-warning">Inicia sesión para dejar un comentario.</div>'
                );
            }
        }).fail(function () {
            $("#bloque-formulario-comentario").hide();
            $("#estado-comentarios").html(
                '<div class="alert alert-warning">No se pudo comprobar la sesión.</div>'
            );
        });
    }

    function cargarComentarios() {
		const idCurso = obtenerIdCurso();
        $.getJSON(`/api/comentarios/curso/${idCurso}`, function (comentarios) {
            const $lista = $("#lista-comentarios");
            $lista.empty();

            if (comentarios.length === 0) {
                $lista.html('<p class="text-muted">Todavía no hay comentarios para este curso.</p>');
                return;
            }

            comentarios.forEach(function (c) {
                const nombreUsuario = c.usuarioId?.nombre || "Usuario";
                const fecha = new Date(c.fecha).toLocaleDateString("es-ES");

                const tarjeta = `
                    <div class="border rounded p-3 mb-3 bg-light">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <strong>${nombreUsuario}</strong>
                            <small class="text-muted">${fecha}</small>
                        </div>
                        <p class="mb-2">Puntuación: ${"★".repeat(c.puntuacion)}${"☆".repeat(5 - c.puntuacion)}</p>
                        <p class="mb-0">${c.comentario}</p>
                    </div>
                `;

                $lista.append(tarjeta);
            });
        }).fail(function () {
            $("#lista-comentarios").html(
                '<div class="alert alert-danger">No se pudieron cargar los comentarios.</div>'
            );
        });
    }

    function enviarComentario() {
		const idCurso = obtenerIdCurso();
        const datos = {
            cursoId: idCurso,
            puntuacion: $("#puntuacion").val(),
            comentario: $("#texto-comentario").val()
        };

        $.ajax({
            url: "/api/comentarios",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function () {
                $("#form-comentario")[0].reset();
                cargarComentarios();
            },
            error: function (xhr) {
                const mensaje = xhr.responseJSON?.mensaje || "No se pudo guardar el comentario.";
                alert(mensaje);
            }
        });
    }

    $(".btn-imprimir").on("click", function () {
        window.print();
    });

	
    $("#form-comentario").on("submit", function (event) {
        event.preventDefault();
        enviarComentario();
    });


    cargarCurso();
	cargarComentarios();
	comprobarSesion();
});



