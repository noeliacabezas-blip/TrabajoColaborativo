$(document).ready(function(){
	$(".boton-leer").on("click", function(event){
		var $articulo = $(this).closest('.entrada');
		$articulo.find('.texto_extra').toggle();
		$articulo.find('.puntos').toggle();
		
		// Cambiamos el texto del "botón"
    if ($(this).text() === "Leer más") {
      $(this).text("Leer menos");
    } else {
      $(this).text("Leer más");
    }
	});
});
