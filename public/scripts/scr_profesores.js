$(document).ready(function () {
    let profesores = [];
    let orden = {
        nombreAsc: true,
        experienciaAsc: true,
        cursosAsc: true
    };

    cargarProfesores();

    function cargarProfesores() {
        $.getJSON("/api/profesores", function (datos) {
            profesores = datos;
            renderizarTabla(profesores);
        }).fail(function () {
            $("#tabla-profesores").html(`
                <tr>
                    <td colspan="5" class="text-danger fw-bold">
                        No se pudieron cargar los profesores.
                    </td>
                </tr>
            `);
        });
    }

    function renderizarTabla(listaProfesores) {
        const $tabla = $("#tabla-profesores");
        $tabla.empty();

        if (!listaProfesores || listaProfesores.length === 0) {
            $tabla.html(`
                <tr>
                    <td colspan="5" class="text-muted">
                        No hay profesores disponibles.
                    </td>
                </tr>
            `);
            return;
        }

        listaProfesores.forEach(function (profesor) {
            const fila = `
                <tr>
                    <td>${profesor.nombre ?? ""}</td>
                    <td>${profesor.especialidad ?? ""}</td>
                    <td>${profesor.experiencia ?? "-"}</td>
                    <td>${profesor.nCursos ?? 0}</td>
                    <td>${profesor.requisitosAdicionales ?? "-"}</td>
                </tr>
            `;
            $tabla.append(fila);
        });
    }

	function ordernarPorNombre() {
        profesores.sort(function (a, b) {
            const nombreA = (a.nombre || "").toLowerCase();
            const nombreB = (b.nombre || "").toLowerCase();

            if (orden.nombreAsc) {
                return nombreA.localeCompare(nombreB);
            }
            return nombreB.localeCompare(nombreA);
        });

        orden.nombreAsc = !orden.nombreAsc;
        renderizarTabla(profesores);
    }

	function ordenarPorExperiencia() {
        profesores.sort(function (a, b) {
            const expA = a.experiencia ?? 0;
            const expB = b.experiencia ?? 0;

            if (orden.experienciaAsc) {
                return expA - expB;
            }
            return expB - expA;
        });

        orden.experienciaAsc = !orden.experienciaAsc;
        renderizarTabla(profesores);
    }

	function ordernarPorCurso() {
        profesores.sort(function (a, b) {
            const cursosA = a.nCursos ?? 0;
            const cursosB = b.nCursos ?? 0;

            if (orden.cursosAsc) {
                return cursosA - cursosB;
            }
            return cursosB - cursosA;
        });

        orden.cursosAsc = !orden.cursosAsc;
        renderizarTabla(profesores);
    }

    $("th.nombre").on("click", ordernarPorNombre);

    $("th.experiencia").on("click", ordenarPorExperiencia);

    $("th.n_cursos").on("click",ordernarPorCurso);
});