document.addEventListener("DOMContentLoaded", function () {

    const fechaInput = document.getElementById("fechaNacimiento");
    const categoriaInput = document.getElementById("categoria");
    const codigoInput = document.getElementById("codigo");
    const form = document.getElementById("animalForm");
    const tabla = document.querySelector("#tablaAnimales tbody");
    const exportarBtn = document.getElementById("exportarCSV");

    // Ahora el contador será por GRUPO + FECHA
    let contadorRegistro = {};

    // Fecha automática hoy
    const hoy = new Date().toISOString().split("T")[0];
    fechaInput.value = hoy;

    // ===== GENERADOR DE CÓDIGO =====
    function generarCodigo() {

        const grupo = categoriaInput.value;
        const fecha = fechaInput.value;

        if (!grupo || !fecha) {
            codigoInput.value = "";
            return;
        }

        const fechaObj = new Date(fecha);

        const año = fechaObj.getFullYear().toString().slice(-2);
        const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
        const dia = String(fechaObj.getDate()).padStart(2, "0");

        const prefijo = grupo + año + mes + dia;

        if (!contadorRegistro[prefijo]) {
            contadorRegistro[prefijo] = 1;
        }

        let contadorActual = contadorRegistro[prefijo];

        // Hasta 99 muestra 2 dígitos, desde 100 muestra 3
        let contadorFormateado =
            contadorActual < 100
                ? String(contadorActual).padStart(2, "0")
                : String(contadorActual).padStart(3, "0");

        codigoInput.value = prefijo + contadorFormateado;
    }

    categoriaInput.addEventListener("change", generarCodigo);
    fechaInput.addEventListener("change", generarCodigo);

    // ===== REGISTRAR ANIMAL =====
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const grupo = categoriaInput.value;
        const fecha = fechaInput.value;

        const ccSeleccionado = document.querySelector('input[name="cc"]:checked');

        if (!ccSeleccionado) {
            alert("Selecciona la Condición Corporal (1-5).");
            return;
        }

        const cc = ccSeleccionado.value;

        const fechaObj = new Date(fecha);
        const año = fechaObj.getFullYear().toString().slice(-2);
        const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
        const dia = String(fechaObj.getDate()).padStart(2, "0");

        const prefijo = grupo + año + mes + dia;

        if (!contadorRegistro[prefijo]) {
            contadorRegistro[prefijo] = 1;
        }

        let contadorActual = contadorRegistro[prefijo];

        let contadorFormateado =
            contadorActual < 100
                ? String(contadorActual).padStart(2, "0")
                : String(contadorActual).padStart(3, "0");

        const codigoFinal = prefijo + contadorFormateado;

        const categoriaTexto = categoriaInput.options[categoriaInput.selectedIndex].text;

        const datos = [
            codigoFinal,
            document.getElementById("nombre").value,
            categoriaTexto,
            fecha,
            document.getElementById("sexo").value,
            document.getElementById("raza").value,
            document.getElementById("color").value,
            cc,
            document.getElementById("madre").value,
            document.getElementById("padre").value,
            document.getElementById("observaciones").value
        ];

        const fila = document.createElement("tr");

        datos.forEach(dato => {
            const celda = document.createElement("td");
            celda.textContent = dato;
            fila.appendChild(celda);
        });

        tabla.appendChild(fila);

        // Incrementar contador después de registrar
        contadorRegistro[prefijo]++;

        form.reset();
        fechaInput.value = hoy;
        codigoInput.value = "";
    });

    // ===== EXPORTAR CSV =====
    exportarBtn.addEventListener("click", function () {

        let csv = [];
        const filas = document.querySelectorAll("table tr");

        filas.forEach(fila => {
            let columnas = fila.querySelectorAll("th, td");
            let filaCSV = [];

            columnas.forEach(col => {
                let texto = col.innerText.replace(/"/g, '""');
                filaCSV.push(`"${texto}"`);
            });

            csv.push(filaCSV.join(","));
        });

        const csvString = csv.join("\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "Registro Ganadero.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    });

});
