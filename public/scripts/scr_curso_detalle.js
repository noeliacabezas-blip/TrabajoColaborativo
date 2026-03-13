$(document).ready(function () {
    function obtenerIdCurso() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }

    const idCurso = obtenerIdCurso();

    function cargarCurso() {
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

            if ($("#curso-profesor-email").length) {
                if (curso.profesorId && curso.profesorId.email) {
                    $("#curso-profesor-email")
                        .text(curso.profesorId.email)
                        .attr("href", `mailto:${curso.profesorId.email}`);
                } else {
                    $("#curso-profesor-email")
                        .text("No disponible")
                        .removeAttr("href");
                }
            }

            if ($("#profesor-foto").length) {
                if (curso.profesorId && curso.profesorId.foto) {
                    $("#profesor-foto")
                        .attr("src", curso.profesorId.foto)
                        .attr("alt", `Foto de ${curso.profesorId.nombre || "profesor"}`)
                        .show();
                } else {
                    $("#profesor-foto").hide();
                }
            }

            $("#curso-descripcion").empty();

            if (curso.descripcion) {
                const parrafos = curso.descripcion.split("\n");
                parrafos.forEach(function (texto) {
                    if (texto.trim() !== "") {
                        $("#curso-descripcion").append(`<p class="card-text">${texto}</p>`);
                    }
                });
            } else {
                $("#curso-descripcion").html('<p class="card-text">Descripción no disponible.</p>');
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
            if (respuesta.logueado) {
                $("#bloque-formulario-comentario").show();
                $("#estado-comentarios").html(
                    `<div class="alert alert-info">Has iniciado sesión como <strong>${respuesta.nombre}</strong>.</div>`
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
        if (!idCurso) {
            $("#lista-comentarios").html(
                '<div class="alert alert-danger">No se ha indicado un curso válido.</div>'
            );
            return;
        }

        $.getJSON(`/api/comentarios/curso/${idCurso}`, function (comentarios) {
            const $lista = $("#lista-comentarios");
            $lista.empty();

            if (!comentarios || comentarios.length === 0) {
                $lista.html('<p class="text-muted">Todavía no hay comentarios para este curso.</p>');
                return;
            }

            comentarios.forEach(function (c) {
                const nombreUsuario = c.usuarioId?.nombre || "Usuario";
                const fecha = c.fecha
                    ? new Date(c.fecha).toLocaleDateString("es-ES")
                    : "Fecha no disponible";

                const puntuacion = Number(c.puntuacion) || 0;
                const estrellasLlenas = "★".repeat(puntuacion);
                const estrellasVacias = "☆".repeat(5 - puntuacion);

                const tarjeta = `
                    <div class="border rounded p-3 mb-3 bg-light">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <strong>${nombreUsuario}</strong>
                            <small class="text-muted">${fecha}</small>
                        </div>
                        <p class="mb-2">Puntuación: ${estrellasLlenas}${estrellasVacias}</p>
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
        if (!idCurso) {
            alert("No se ha podido identificar el curso.");
            return;
        }

        const datos = {
            cursoId: idCurso,
            puntuacion: $("#puntuacion").val(),
            comentario: $("#texto-comentario").val().trim()
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

    $(document).on("usuarioLogueado", function () {
        comprobarSesion();
    });

    cargarCurso();
    cargarComentarios();
    comprobarSesion();
});