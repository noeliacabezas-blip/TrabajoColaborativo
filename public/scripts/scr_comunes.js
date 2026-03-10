$(document).ready(function(){
	
    cargarMenuCursos();
    
	// Código que gestiona los botones del menú de navegación que aumentan o disminuyen el tamaño de la fuente
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
	
	// Código que carga los menús de cursos disponibles desde la ruta de la API
	$.getJSON("/api/cursos", function(cursos){	
        // Limpiamos el menú para no duplicar
        $("#menu_cursos").empty();
			
        if (cursos.length === 0) {
            $("#menu_cursos").append('<li>No hay cursos disponibles</li>');
            return;
        }
		
        $.each(cursos, function(id, curso){  			
            $("#menu_cursos").append(
				'<li><a class="dropdown-item text-white" href="curso_detalle?id=' + curso._id + '">' + curso.titulo + '</a></li>'
            );
        });
    });
	
	//Código que actualiza la fecha y hora en el footer
	function actualizaHora(){
		 var fecha = new Date();
        
        // Obtener fecha y hora en formato local 
        var fechaAhora = fecha.toLocaleDateString() + " - " + fecha.toLocaleTimeString();        
       
        // Escribe la fecha en el footer
        $("#txt-fecha").text(fechaAhora);        
    }

    // Ejecutar la función al cargar la página
    actualizaHora();
	
    // Configurar para que se repita cada 1000 milisegundos (1 segundo)
    setInterval(actualizaHora, 1000);	
});

function cargarMenuCursos() {
    const $menu = $("#menu_cursos");

    if ($menu.length === 0) return; // Si la página no tiene ese menú, no hace nada

    $.getJSON("/api/cursos", function (cursos) {
        $menu.empty();

        cursos.forEach(function (curso) {
            const item = `
                <li>
                    <a class="dropdown-item text-white" href="/curso_detalle?id=${curso._id}">
                        ${curso.titulo}
                    </a>
                </li>
            `;
            $menu.append(item);
        });
    }).fail(function () {
        $menu.html('<li><span class="dropdown-item-text text-white">No se pudieron cargar los cursos</span></li>');
    });
}



