$(document).ready(function(){
    function activarLeerMas() {
        $(document).off('click', '.boton-leer').on('click', '.boton-leer', function(){
            const $articulo = $(this).closest('.entrada');
            $articulo.find('.texto_extra').toggle();
            $articulo.find('.puntos').toggle();
            $(this).text($(this).text() === 'Leer más' ? 'Leer menos' : 'Leer más');
        });
    }

    function pintarCursosNuevos(cursos) {
        const $contenedor = $('#bloque-cursos-nuevos');
        $contenedor.empty();

        if (!cursos || cursos.length === 0) {
            $contenedor.html('<p class="mb-0">No hay cursos nuevos disponibles por el momento.</p>');
            return;
        }

        const lista = cursos.map((curso) => `
            <li class="mb-2">
                <a href="/curso_detalle?id=${curso._id}" class="fw-bold">${curso.titulo}</a>
                <div class="small text-muted">${curso.categoria} · ${curso.nivel} · ${(curso.profesorId && curso.profesorId.nombre) ? curso.profesorId.nombre : 'Profesor pendiente'}</div>
            </li>
        `).join('');

        $contenedor.html(`
            <p class="mb-2">Estos son los cursos incorporados más recientemente a la plataforma:</p>
            <ul class="mb-0 ps-3">${lista}</ul>
        `);
    }

    function pintarCategorias(categorias) {
        const $contenedor = $('#bloque-categorias-destacadas');
        $contenedor.empty();

        if (!categorias || categorias.length === 0) {
            $contenedor.html('<p class="mb-0">No hay categorías destacadas disponibles.</p>');
            return;
        }

        const badges = categorias.map((cat) => `
            <span class="badge text-bg-primary me-2 mb-2 p-2">${cat._id} (${cat.total})</span>
        `).join('');

        $contenedor.html(`
            <p class="mb-2">La oferta actual se concentra especialmente en estas áreas:</p>
            <div>${badges}</div>
            <div class="mt-3"><a href="/listado_cursos" class="btn btn-primary btn-sm">Ver catálogo completo</a></div>
        `);
    }

    function cargarResumenHome() {
        $.getJSON('/api/cursos/home/resumen', function (respuesta) {
            pintarCursosNuevos(respuesta.cursosNuevos);
            pintarCategorias(respuesta.categoriasDestacadas);
        }).fail(function () {
            $('#bloque-cursos-nuevos').html('<p class="text-danger mb-0">No se pudieron cargar los cursos nuevos.</p>');
            $('#bloque-categorias-destacadas').html('<p class="text-danger mb-0">No se pudieron cargar las categorías destacadas.</p>');
        });
    }

    activarLeerMas();
    cargarResumenHome();
});
