$(document).ready(function(){
	var tamFuente = 1; // Tamaño base de la fuente en unidades em	
	$("#btn-aumentar").on("click", function(event){		
		tamFuente += 0.05;
        $("main").css("font-size", tamFuente + "em");
	});
	$("#btn-disminuir").on("click", function(event){
		if (tamFuente > 0.7){ // Que no disminuya menos de 0.7em la fuente para que no se haga demasiado pequeño el texto
			tamFuente -= 0.05;
			$("main").css("font-size", tamFuente + "em");
		}
	});	
});