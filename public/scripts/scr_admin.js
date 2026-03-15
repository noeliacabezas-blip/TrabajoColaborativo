$(document).ready(function () {
    let profesores = [];
    let cursoEditandoId = null;

    function comprobarAcceso() {
        return $.getJSON('/api/usuario/estado').then(function (estado) {
            if (!estado.logueado || estado.rol !== 'admin') {
                window.location.href = '/';
                return $.Deferred().reject().promise();
            }
            $('#admin-bienvenida').text(`Sesión iniciada como ${estado.nombre} (${estado.rol})`);
        });
    }

    function cargarOpciones() {
        return $.getJSON('/api/cursos/admin/opciones', function (data) {
            profesores = data.profesores || [];
            const $select = $('#profesorId');
            $select.empty().append('<option value="">Selecciona un profesor</option>');
            profesores.forEach(function (profesor) {
                $select.append(`<option value="${profesor._id}">${profesor.nombre} · ${profesor.especialidad}</option>`);
            });
        });
    }

    function cargarCursos() {
        $.getJSON('/api/cursos', function (cursos) {
            const $tbody = $('#tabla-admin-cursos');
            $tbody.empty();

            if (!cursos.length) {
                $tbody.html('<tr><td colspan="7" class="text-center">No hay cursos registrados.</td></tr>');
                return;
            }

            cursos.forEach(function (curso) {
                $tbody.append(`
                    <tr>
                        <td>${curso.titulo}</td>
                        <td>${curso.categoria}</td>
                        <td>${curso.nivel}</td>
                        <td>${curso.duracion}</td>
                        <td>${curso.profesorId ? curso.profesorId.nombre : 'N/D'}</td>
                        <td>${Array.isArray(curso.temario) ? curso.temario.length : 0}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary me-2 btn-editar" data-id="${curso._id}">Editar</button>
                            <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${curso._id}">Eliminar</button>
                        </td>
                    </tr>
                `);
            });
        }).fail(function (xhr) {
            const msg = xhr.responseJSON?.mensaje || 'No se pudieron cargar los cursos.';
            $('#tabla-admin-cursos').html(`<tr><td colspan="7" class="text-center text-danger">${msg}</td></tr>`);
        });
    }

    function limpiarFormulario() {
        cursoEditandoId = null;
        $('#form-admin-curso')[0].reset();
        $('#cursoId').val('');
        $('#modalCursoLabel').text('Nuevo curso');
        $('#btnGuardarCurso').text('Crear curso');
    }

    function rellenarFormulario(curso) {
        cursoEditandoId = curso._id;
        $('#cursoId').val(curso._id);
        $('#titulo').val(curso.titulo);
        $('#categoria').val(curso.categoria);
        $('#nivel').val(curso.nivel);
        $('#duracion').val(curso.duracion);
        $('#imagen').val(curso.imagen);
        $('#profesorId').val(curso.profesorId?._id || '');
        $('#descripcion').val(curso.descripcion);
        $('#temario').val(Array.isArray(curso.temario) ? curso.temario.join('\n') : '');
        $('#modalCursoLabel').text('Editar curso');
        $('#btnGuardarCurso').text('Guardar cambios');
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCurso'));
        modal.show();
    }

    function recogerFormulario() {
        return {
            titulo: $('#titulo').val().trim(),
            categoria: $('#categoria').val().trim(),
            nivel: $('#nivel').val().trim(),
            duracion: $('#duracion').val().trim(),
            imagen: $('#imagen').val().trim(),
            profesorId: $('#profesorId').val(),
            descripcion: $('#descripcion').val().trim(),
            temario: $('#temario').val().trim()
        };
    }

    $('#btnNuevoCurso').on('click', function () {
        limpiarFormulario();
    });

    $('#form-admin-curso').on('submit', function (event) {
        event.preventDefault();
        const datos = recogerFormulario();
        const esEdicion = Boolean(cursoEditandoId);

        $.ajax({
            url: esEdicion ? `/api/cursos/${cursoEditandoId}` : '/api/cursos',
            method: esEdicion ? 'PUT' : 'POST',
            contentType: 'application/json',
            data: JSON.stringify(datos),
            success: function () {
                bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCurso')).hide();
                limpiarFormulario();
                cargarCursos();
            },
            error: function (xhr) {
                const errores = xhr.responseJSON?.errores;
                const mensaje = errores ? errores.join('\n') : (xhr.responseJSON?.mensaje || 'No se pudo guardar el curso.');
                alert(mensaje);
            }
        });
    });

    $(document).on('click', '.btn-editar', function () {
        const id = $(this).data('id');
        $.getJSON(`/api/cursos/${id}`, function (curso) {
            rellenarFormulario(curso);
        }).fail(function () {
            alert('No se pudo cargar el curso para editarlo.');
        });
    });

    $(document).on('click', '.btn-eliminar', function () {
        const id = $(this).data('id');
        if (!confirm('¿Seguro que deseas eliminar este curso?')) return;

        $.ajax({
            url: `/api/cursos/${id}`,
            method: 'DELETE',
            success: function () {
                cargarCursos();
            },
            error: function (xhr) {
                alert(xhr.responseJSON?.mensaje || 'No se pudo eliminar el curso.');
            }
        });
    });

    comprobarAcceso().then(function () {
        return cargarOpciones();
    }).then(function () {
        cargarCursos();
    });
});
