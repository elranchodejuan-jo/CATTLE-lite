const scanBtn = document.getElementById("scanBtn");
const result = document.getElementById("result");

scanBtn.addEventListener("click", async () => {
  if (!("NDEFReader" in window)) {
    result.innerHTML = "❌ NFC no compatible en este dispositivo.";
    return;
  }

  try {
    const reader = new NDEFReader();
    await reader.scan();
    result.innerHTML = "📡 Escaneando... acerca el arete";

    reader.onreading = event => {
      const chipID = event.serialNumber;
      manejarChip(chipID);
    };

  } catch (error) {
    result.innerHTML = "⚠️ Error al leer NFC: " + error;
  }
});

function manejarChip(id) {
  const animales = JSON.parse(localStorage.getItem("cattle")) || {};

  if (animales[id]) {
    result.innerHTML = `
      ✅ Animal encontrado<br>
      <b>ID:</b> ${id}<br>
      <b>Nombre:</b> ${animales[id].nombre}<br>
      <b>Especie:</b> ${animales[id].especie}
    `;
  } else {
    result.innerHTML = `
      🆕 Chip nuevo detectado<br>
      ID: ${id}<br><br>
      <button onclick="crearAnimal('${id}')">➕ Crear nuevo animal</button>
    `;
  }
}

function crearAnimal(id) {
  const nombre = prompt("Nombre del animal:");
  const especie = prompt("Especie (bovino, porcino, etc):");

  if (!nombre || !especie) return;

  const animales = JSON.parse(localStorage.getItem("cattle")) || {};

  animales[id] = {
    nombre,
    especie,
    creado: new Date().toISOString()
  };

  localStorage.setItem("cattle", JSON.stringify(animales));

  result.innerHTML = "🐮 Animal creado y guardado localmente.";
}
