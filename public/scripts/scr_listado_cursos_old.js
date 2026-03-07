$(document).ready(function(){		
	// Crea el listado de cursos disponibles en Cards.
	$.getJSON("../data/lista_cursos.json", function(cursos){	
		$.each(cursos, function(id, curso){
			$("#contenedorCursos").append(
				'<div class="col-lg-4 col-md-6 col-sm-12 curso ' + curso.categoria + '">' + 
					'<div class="card fondo_corporativo_azul_claro h-100">' +
						'<img src="' + curso.img + '" class="card-img-top mt-4 " alt="' + curso.curso +'">' +
						'<div class="card-body">' + 
							'<h3 class="card-title">' + curso.curso + '</h3>' +
							'<p class="card-text"><span class="fw-bold">Categoría:</span> ' + curso.categoria + '</p>' +
							'<p class="card-text"><span class="fw-bold">Nivel:</span> ' + curso.nivel + '</p>' +
							'<a href="' + curso.url + '" class="btn btn-primary">Ver detalles del curso</a>' +
						'</div>' +
					'</div>' + 
				'</div>'
			);
		});
	});
	
	// Función para comprobar los filtros (select y text)
	function filtrarCursos(){
		var categoria =  $("#filtroCategoria").val();
		var textoFiltro = $("#buscar").val().toLowerCase();
		
		$(".curso").each(function(){
			var $tarjeta = $(this);
			var tituloCurso = $tarjeta.find(".card-title").text().toLowerCase();
			
			if (($tarjeta.hasClass(categoria) || categoria === "") && (tituloCurso.indexOf(textoFiltro) > -1)){
				$tarjeta.show();
			} else {
				$tarjeta.hide();
			}
		});
	}
	
	$("#filtroCategoria").on("change", filtrarCursos);
	$("#buscar").on("keyup", filtrarCursos);
	
	
	// Botón borrar filtros:
	$("#btnLimpiar").on("click", function() {
		$("#buscar").val("");
		$("#filtroCategoria").val("");
		filtrarCursos();
	});
});



