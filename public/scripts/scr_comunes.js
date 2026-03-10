$(document).ready(function(){
	$.getJSON('/api/usuario/estado', function(res) {
        actualiza_estado_sesion_menu(res);
    });
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

    // Validar usuario:
    $("#formulario_login").on("submit", function(event){
        event.preventDefault();

        const datosLogin = {
           email: $("#usuario").val(),
           contrasenna: $("#password").val()
        };
        $.ajax({
            url: '/api/usuario/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(datosLogin),
            success: function(respuesta){
                //login correcto:
                window.alert(respuesta.mensaje);

                $("#formulario_login")[0].reset(); // Limpia el formulario
                bootstrap.Modal.getInstance(document.getElementById('modalLogin')).hide();  //cierra la ventana modal

                // actualizamos la barra de menú:
                actualiza_estado_sesion_menu({
                    logueado: true,
                    nombre: respuesta.nombre,
                    rol: respuesta.rol
                });

                // si es un admin -> le lleva a su panel
                if (respuesta.rol === 'admin') {
                    window.location.href = "/admin.html"
                } 
            },
            error: function(fallo){
                const mensaje_error = fallo.responseJSON ? fallo.responseJSON.mensaje : "Error al conectar";
                window.alert("Error: " + mensaje_error);

                //Borramos la contraseña:
                $("#password").val("");
            }
        });
    });


    //Registro usuario:
     $("#formulario_registro").on("submit", function(event){
        event.preventDefault();
        
        const datosRegistro = {
            nombre: $("#reg_nombre").val(),
            email: $("#reg_email").val(),
            contrasenna: $("#reg_password").val(),
            rol: 'alumno'
        }
        $.ajax({
            url: '/api/usuario/registro',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(datosRegistro),
            success: function(respuesta) {
                window.alert(respuesta.mensaje);

                $("#formulario_registro")[0].reset(); // Limpia el formulario

                // Cambia a la pestaña de login automáticamente
                $('#authTabs button[data-bs-target="#tabLogin"]').tab('show');
            },
            error: function(fallo) {
                window.alert("Error al registrar: " + fallo.responseJSON.mensaje);
            }
        });
     });


     // Cerrar sesión:
     $("#boton_logout").on("click", function(event) {
        event.preventDefault(); // Evitamos cualquier acción por defecto

        // Llamamos al servidor para que borre la sesión/cookie
        $.ajax({
            url: '/api/usuario/logout',
            type: 'GET',
            success: function(respuesta) {
                window.alert(respuesta.mensaje || "Sesión cerrada correctamente");

            // Actualiza el menú para que vuelva a mostrar "Iniciar Sesión"
            actualiza_estado_sesion_menu({ logueado: false });
            },
            error: function() {
                window.alert("Error al intentar cerrar sesión");
            }
        });
    });
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

function actualiza_estado_sesion_menu (usuario){
    if (usuario && usuario.logueado){
        // ocultamos el botón de inicio sesión:
        $("#usuario_invitado").addClass("d-none");
        // mostramos los datos del usuario y botón de logoff
        $("#usuario_logueado").removeClass("d-none");
        $("#nombre_usuario").text(usuario.nombre);
        if (usuario.rol === 'admin'){
             $("#usuario_admin").removeClass("d-none");
        }
    } else {
        $("#usuario_invitado").removeClass("d-none");
        $("#usuario_logueado").addClass("d-none");
        $("#usuario_admin").addClass("d-none");
    }
}


