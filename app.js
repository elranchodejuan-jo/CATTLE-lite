document.addEventListener("DOMContentLoaded", function () {

    const fechaInput = document.getElementById("fechaNacimiento");
    const categoriaInput = document.getElementById("categoria");
    const codigoInput = document.getElementById("codigo");
    const form = document.getElementById("animalForm");
    const tabla = document.querySelector("#tablaAnimales tbody");
    const exportarBtn = document.getElementById("exportarCSV");

    // ===== CARGAR DATOS DESDE LOCAL STORAGE =====
    let animales = JSON.parse(localStorage.getItem("animales")) || [];
    let contadorRegistro = {};

    const hoy = new Date().toISOString().split("T")[0];
    fechaInput.value = hoy;

    // ===== RECONSTRUIR TABLA Y CONTADORES =====
    function reconstruirDesdeStorage() {

        animales.forEach(animal => {
            agregarFilaATabla(animal);

            const prefijo = animal.codigo.slice(0, 7);
            const contador = parseInt(animal.codigo.slice(7));

            if (!contadorRegistro[prefijo] || contadorRegistro[prefijo] <= contador) {
                contadorRegistro[prefijo] = contador + 1;
            }
        });
    }

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

        let contadorFormateado =
            contadorActual < 100
                ? String(contadorActual).padStart(2, "0")
                : String(contadorActual).padStart(3, "0");

        codigoInput.value = prefijo + contadorFormateado;
    }

    categoriaInput.addEventListener("change", generarCodigo);
    fechaInput.addEventListener("change", generarCodigo);

    // ===== AGREGAR FILA A TABLA =====
    function agregarFilaATabla(animal) {

        const fila = document.createElement("tr");

        const datos = [
            animal.codigo,
            animal.nombre,
            animal.categoria,
            animal.fecha,
            animal.sexo,
            animal.raza,
            animal.color,
            animal.cc,
            animal.madre,
            animal.padre,
            animal.observaciones
        ];

        datos.forEach(dato => {
            const celda = document.createElement("td");
            celda.textContent = dato;
            fila.appendChild(celda);
        });

        tabla.appendChild(fila);
    }

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

        const nuevoAnimal = {
            codigo: codigoFinal,
            nombre: document.getElementById("nombre").value,
            categoria: categoriaTexto,
            fecha: fecha,
            sexo: document.getElementById("sexo").value,
            raza: document.getElementById("raza").value,
            color: document.getElementById("color").value,
            cc: ccSeleccionado.value,
            madre: document.getElementById("madre").value,
            padre: document.getElementById("padre").value,
            observaciones: document.getElementById("observaciones").value
        };

        animales.push(nuevoAnimal);

        localStorage.setItem("animales", JSON.stringify(animales));

        agregarFilaATabla(nuevoAnimal);

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

    reconstruirDesdeStorage();

});

// ===== SERVICE WORKER =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js")
      .then(() => console.log("Service Worker registrado"))
      .catch(err => console.log("Error:", err));
  });
}
