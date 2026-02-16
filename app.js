document.addEventListener("DOMContentLoaded", function () {

    const fechaInput = document.getElementById("fechaNacimiento");
    const categoriaInput = document.getElementById("categoria");
    const codigoInput = document.getElementById("codigo");
    const form = document.getElementById("animalForm");
    const tabla = document.querySelector("#tablaAnimales tbody");
    const exportarBtn = document.getElementById("exportarCSV");

    let contadorDiario = {};

    // Fecha automática hoy (editable)
    const hoy = new Date().toISOString().split("T")[0];
    fechaInput.value = hoy;

    // Generador de código
    function generarCodigo() {

        const categoria = categoriaInput.value;
        const fecha = fechaInput.value;

        if (!categoria || !fecha) {
            codigoInput.value = "";
            return;
        }

        const fechaObj = new Date(fecha);

        const año = fechaObj.getFullYear().toString().slice(-2);
        const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
        const dia = String(fechaObj.getDate()).padStart(2, "0");

        const claveFecha = año + mes + dia;

        if (!contadorDiario[claveFecha]) {
            contadorDiario[claveFecha] = 1;
        }

        const consecutivo = String(contadorDiario[claveFecha]).padStart(2, "0");

        const codigoFinal = categoria + año + mes + dia + consecutivo;
        codigoInput.value = codigoFinal;
    }

    categoriaInput.addEventListener("change", generarCodigo);
    fechaInput.addEventListener("change", generarCodigo);

    // Agregar animal
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const categoriaTexto = categoriaInput.options[categoriaInput.selectedIndex].text;

        const datos = [
            codigoInput.value,
            document.getElementById("nombre").value,
            categoriaTexto,
            fechaInput.value,
            document.getElementById("sexo").value,
            document.getElementById("raza").value,
            document.getElementById("color").value,
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

        // Aumentar contador SOLO cuando se registra realmente
        const fechaObj = new Date(fechaInput.value);
        const año = fechaObj.getFullYear().toString().slice(-2);
        const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
        const dia = String(fechaObj.getDate()).padStart(2, "0");
        const claveFecha = año + mes + dia;

        contadorDiario[claveFecha]++;

        form.reset();
        fechaInput.value = hoy;
        codigoInput.value = "";
    });

    // Exportar CSV
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
        a.download = "registro_ganadero.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    });

});
