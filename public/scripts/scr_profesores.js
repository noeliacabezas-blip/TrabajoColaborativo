$(document).ready(function(){
	var lista_profesores = [
	{nombre: "José Álvarez Álvarez", especializacion: "Tecnología", experiencia: 9, n_cursos: 3, requisitos: "Sin requisitos"},
	{nombre: "María García García", especializacion: "Empresa", experiencia: 15, n_cursos: 2, requisitos: "Sin requisitos"},
	{nombre: "Teresa Alonso Alonso", especializacion: "Diseño", experiencia: 6, n_cursos: 2, requisitos: "Sin requisitos"},
	{nombre: "Jesús Castro Castro", especializacion: "Idioma", experiencia: 7, n_cursos: 2, requisitos: "Sin requisitos"},
	{nombre: "Ana Blanco Blanco", especializacion: "Tecnología", experiencia: 3, n_cursos: 1, requisitos: "Sin requisitos"},
	{nombre: "Ana Rodriguez Fernández", especializacion: "Diseño", experiencia: 12, n_cursos: 4, requisitos: "Sin requisitos"}
	];
	
	var ordenNombre = false; //No están ordenados alfabéticamente -> en un inicio están según los lee del array
	var ordenExperiencia = false;
	var ordenN_cursos = false;
	
	function dibujar_tabla(){
		$("#tabla-profesores").empty();		
		lista_profesores.forEach(function(profesor){
			var fila ='<tr>' +
					'<td>' + profesor.nombre + '</td>' +
					'<td>' + profesor.especializacion + '</td>' +
					'<td>' + profesor.experiencia + '</td>' +
					'<td>' + profesor.n_cursos + '</td>' +
					'<td>' + profesor.requisitos + '</td>' +
				'</tr>';			
			$("#tabla-profesores").append(fila);
		});
	}
	
	function ordenarNombre(){
		// Si estaba ordenado alfabéticamente:
		if (ordenNombre){
			lista_profesores.sort((a,b) => b.nombre.localeCompare(a.nombre)); //orden inverso al alfabético
			ordenNombre=false;
		}else { // Si no estaba ordenado alfabéticamente:
			lista_profesores.sort((a,b) => a.nombre.localeCompare(b.nombre)); //orden alfabético
			ordenNombre=true;
		}
		ordenExperiencia=false;
		ordenN_cursos=false;
		dibujar_tabla();
	}
	
	function ordenarExperiencia(){
		if(ordenExperiencia){
			lista_profesores.sort((a,b) => b.experiencia - a.experiencia); //orden de mayor a menor experiencia
			ordenExperiencia=false;
		}else{
			lista_profesores.sort((a,b) => a.experiencia - b.experiencia); //orden de menor a mayor experiencia
			ordenExperiencia=true;
		}
		ordenNombre=false;
		ordenN_cursos=false;
		dibujar_tabla();
	}
	
	function ordenarN_cursos(){
		if(ordenN_cursos){
			lista_profesores.sort((a,b) => b.n_cursos - a.n_cursos); //orden de mayor a menor número de cursos
			ordenN_cursos=false;
		}else{
			lista_profesores.sort((a,b) => a.n_cursos - b.n_cursos); //orden de menor a mayor número de cursos
			ordenN_cursos=true;
		}
		ordenNombre=false;
		ordenExperiencia=false;
		dibujar_tabla();
	}
	$(".nombre").on("click", ordenarNombre);
	$(".experiencia").on("click", ordenarExperiencia);
	$(".n_cursos").on("click", ordenarN_cursos);
	dibujar_tabla();
});