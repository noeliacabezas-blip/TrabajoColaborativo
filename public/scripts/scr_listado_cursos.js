$(document).ready(function(){		
    // 1. Creamos una función para pedir los datos al servidor
    function cargarCursosDesdeBD() {
        // Obtenemos los valores de los inputs para enviarlos como filtros al servidor
        const filtros = {
            categoria: $("#filtroCategoria").val(),
            titulo: $("#buscar").val()
        };

        // Obtenemos los cursos  "../data/lista_cursos.json" por la ruta de la API
        $.getJSON("/api/cursos", filtros, function(cursos){	
            // Limpiamos el contenedor para no duplicar tarjetas
            $("#contenedorCursos").empty();
			
            if (cursos.length === 0) {
                $("#contenedorCursos").append('<p class="text-center">No se encontraron cursos con esos filtros.</p>');
                return;
            }

            $.each(cursos, function(id, curso){                
                $("#contenedorCursos").append(
                    '<div class="col-lg-4 col-md-6 col-sm-12 curso">' + 
                        '<div class="card fondo_corporativo_azul_claro h-100">' +
                            '<img src="' + curso.imagen + '" class="card-img-top mt-4" alt="' + curso.titulo +'">' +
                            '<div class="card-body">' + 
                                '<h3 class="card-title">' + curso.titulo + '</h3>' +
                                '<p class="card-text"><span class="fw-bold">Categoría:</span> ' + curso.categoria + '</p>' +
                                '<p class="card-text"><span class="fw-bold">Nivel:</span> ' + curso.nivel + '</p>' +
                                // Mostramos el nombre del profesor gracias al .populate() del backend
                                '<p class="card-text"><span class="fw-bold">Profesor:</span> ' + (curso.profesorId ? curso.profesorId.nombre : "N/A") + '</p>' +
                                '<a href="/curso_detalle.html?id=' + curso._id + '" class="btn btn-primary">Ver detalles del curso</a>' +
                            '</div>' +
                        '</div>' + 
                    '</div>'
                );
            });
        });
    }

    // 2. Ejecutamos la carga inicial al abrir la página
    cargarCursosDesdeBD();

    // 3. Escuchamos cambios en los filtros para recargar desde la BD
    $("#filtroCategoria").on("change", cargarCursosDesdeBD);
	$("#buscar").on("keyup", cargarCursosDesdeBD);
    
    // Usamos un pequeño retraso al escribir para no saturar la base de datos
    //let temporizador;
   // $("#buscar").on("keyup", function() {
   //     clearTimeout(temporizador);
   //     temporizador = setTimeout(cargarCursosDesdeBD, 300);
    //});
    
    // Botón borrar filtros:
    $("#btnLimpiar").on("click", function() {
        $("#buscar").val("");
        $("#filtroCategoria").val("");
        cargarCursosDesdeBD();
    });
});