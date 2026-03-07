$(document).ready(function(){	
	
	var nombreInvalido = false;
	var correoInvalido = false;
	var asuntoInvalido = false;
	var contador_caracteres = 0;
	var mensajeInvalido =false;
	
	// Si pierde el foco del campo nombre sin introducir ningún caracter marca el error, si hay texto lo marca como válido
	$("#nombre").on("blur", function(){
		if ($(this).val() === ""){			
			$("#nombre_ayuda").show();
			$(this).addClass("is-invalid").removeClass("is-valid");
			nombreInvalido=true;
		}else{
			$(this).addClass("is-valid").removeClass("is-invalid");
		}
	});
	
	// Si el campo nombre, tenía marcado error, y se empieza a escribir en el se limpia el error.
	$("#nombre").on("input", function(){
		if (nombreInvalido && ($(this).val() !== "")){
				nombreInvalido=false;
				$(this).removeClass("is-invalid");
				$("#nombre_ayuda").hide();
		}
	});
	
	function validarEmail(email) {
		// Expresión regular para validar un correo electrónico
		const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		return regex.test(email);
	}
	
	// Si pierde el foco del campo correo electrónico sin introducir un formato correcto marca el error, si es correcto lo marca como válido
	$("#correo").on("blur", function(){
		if (($(this).val() === "") || !validarEmail($(this).val())){			
			$("#correo_ayuda").show();
			$(this).addClass("is-invalid").removeClass("is-valid");
			correoInvalido=true;
		}else{
			$(this).addClass("is-valid").removeClass("is-invalid");
		}
	});
	
	// Si el correo contiene un error, comprueba si se introduce en formato correcto para quitar las marcas de error
	$("#correo").on("input", function(){
		if (correoInvalido && validarEmail($(this).val())){
			$("#correo_ayuda").hide();
			$(this).removeClass("is-invalid");
			correoInvalido = false;
		}
	});
	
	// Si pierde el foco del campo nombre sin introducir ningún caracter marca el error, si hay texto lo marca como válido
	$("#asunto").on("blur", function(){
		if ($(this).val() === ""){			
			$("#asunto_ayuda").show();
			$(this).addClass("is-invalid").removeClass("is-valid");
			asuntoInvalido=true;
		}else{
			$(this).addClass("is-valid").removeClass("is-invalid");
		}
	});
	
	// Si el campo nombre, tenía marcado error, y se empieza a escribir en el se limpia el error.
	$("#asunto").on("input", function(){
		if (asuntoInvalido && ($(this).val() !== "")){
				asuntoInvalido=false;
				$(this).removeClass("is-invalid");
				$("#asunto_ayuda").hide();
		}
	});
	
	$("#mensaje").on("input", function(){
		contador_caracteres = $(this).val().length;
		$("#contador").text(contador_caracteres);
		
		if (mensajeInvalido && (contador_caracteres >=300)){
			mensajeInvalido=false;
			$(this).removeClass("is-invalid");
			$("#mensaje_ayuda").hide();
		}
	});
	
	$("#mensaje").on("blur", function(){
		if ( contador_caracteres < 300){
			$("#mensaje_ayuda").show();
			$(this).addClass("is-invalid").removeClass("is-valid");
			mensajeInvalido=true;			
		} else{
			$(this).addClass("is-valid").removeClass("is-invalid");
		}		
	});
	
	$(".btn-primary").on("click", function(event){
		event.preventDefault(); // que no borre los campos hasta que no se compruebe que todo está OK
		var nombre_OK = false;
		var correo_OK = false;
		var asunto_OK = false;
		var mensaje_OK = false;
		var mensaje_info = "";
		
		if ($("#nombre").hasClass("is-valid")){
			nombre_OK=true;
			mensaje_info += "\t\u2705 El campo nombre es correcto.\n";
		} else if (!nombreInvalido){
			$("#nombre_ayuda").show();
			$("#nombre").addClass("is-invalid");
			nombreInvalido=true;
			mensaje_info += "\t\u274c El campo nombre no es correcto. Por favor, introduzca su nombre.\n";
		} else{
			mensaje_info += "\t\u274c El campo nombre no es correcto. Por favor, introduzca su nombre..\n";
		}
		
		if ($("#correo").hasClass("is-valid")){
			correo_OK=true;
			mensaje_info += "\t\u2705  El campo correo es correcto.\n";
		} else if (!correoInvalido){
			$("#correo_ayuda").show();
			$("#correo").addClass("is-invalid");
			correoInvalido=true;
			mensaje_info += "\t\u274c El campo correo no es correcto. Por favor, introduzca un correo electrónico.\n";
		} else{
			mensaje_info += "\t\u274c El campo correo no es correcto. Por favor, introduzca un correo electrónico.\n";
		}
		
		if ($("#asunto").hasClass("is-valid")){
			asunto_OK=true;
			mensaje_info += "\t\u2705 El campo asunto es correcto.\n";
		} else if (!asuntoInvalido){
			$("#asunto_ayuda").show();
			$("#asunto").addClass("is-invalid");
			asuntoInvalido=true;
			mensaje_info += "\t\u274c El campo asunto no es correcto. Por favor, introduzca un asunto sobre su consulta.\n";
		}else{
			mensaje_info += "\t\u274c El campo asunto no es correcto. Por favor, introduzca un asunto sobre su consulta.\n";
		}
		
		if ($("#mensaje").hasClass("is-valid")){
			mensaje_OK=true;
			mensaje_info += "\t\u2705 El campo mensaje es correcto.\n";
		} else if (!mensajeInvalido){
			$("#mensaje_ayuda").show();
			$("#mensaje").addClass("is-invalid");
			mensajeInvalido=true;
			mensaje_info += "\t\u274c El campo mensaje no es correcto. Por favor, es necesario que el mensaje tenga una longitud mínima de 300 caracteres.\n";
		}else{
			mensaje_info += "\t\u274c El campo mensaje no es correcto. Por favor, es necesario que el mensaje tenga una longitud mínima de 300 caracteres.\n";
		}
		
		if (nombre_OK && correo_OK && asunto_OK && mensaje_OK){
			window.alert("\u2705\u2705 ¡Formulario validado!\u2705\u2705\n\nTodos los campos son correctos.\n\nEl mensaje se ha enviado.");
			$("#formulario_contacto")[0].reset();
			$(".is-valid").removeClass("is-valid");
			$("#contador").text("0");
		} else{
			window.alert("\u274c\u274c El formulario contiene errores y no se puede enviar. \u274c\u274c\n" + mensaje_info);
		}
	});
});