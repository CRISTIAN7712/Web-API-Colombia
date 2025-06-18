const API_BASE = "https://api-colombia.com/api/v1";
const departmentsSelect = document.getElementById("departments");
const content = document.getElementById("content");

async function loadDepartments() {
  const res = await fetch(`${API_BASE}/Department`);
  const departments = await res.json();

  departmentsSelect.innerHTML = `<option value="">-- Seleccione un departamento --</option>`;
  departments.forEach(dep => {
    const option = document.createElement("option");
    option.value = dep.id;
    option.textContent = dep.name;
    departmentsSelect.appendChild(option);
  });
}

departmentsSelect.addEventListener("change", async function () {
  const departmentId = this.value;
  if (!departmentId) {
    content.innerHTML = "<p>Seleccione un departamento para ver sus ciudades.</p>";
    return;
  }

  content.innerHTML = "<p>Cargando ciudades...</p>";
  try {
    const res = await fetch(`${API_BASE}/Department/${departmentId}/cities`);
    const cities = await res.json();

    content.innerHTML = `<h2>Ciudades</h2>`;
    if (cities.length === 0) {
      content.innerHTML += "<p>No se encontraron ciudades para este departamento.</p>";
    } else {
      cities.forEach(city => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `<strong>${city.name}</strong>`;
        content.appendChild(div);
      });
    }
  } catch (err) {
    console.error(err);
    content.innerHTML = "<p style='color:red;'>Error al cargar las ciudades.</p>";
  }
});

function showView(id) {
  document.querySelectorAll(".view").forEach(view => view.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  if (id === "presidents") loadPresidents();
  else if (id === "regions") loadRegions();
  else if (id === "attractions") loadAttractions();
  else if (id === "country") loadCountry();
}

async function loadPresidents() {
  const container = document.getElementById("presidents");
  container.innerHTML = "<h2>Presidentes de Colombia</h2><p>Cargando...</p>";

  const res = await fetch(`${API_BASE}/President`);
  const data = await res.json();

  // Ordenar del más antiguo al más reciente
  data.sort((a, b) => new Date(a.startPeriodDate) - new Date(b.startPeriodDate));

  container.innerHTML = `<h2>Presidentes</h2>` + data.map(p => `
    <div class="item">
      <strong>${p.name} ${p.lastName}</strong><br>
      Periodo: ${p.startPeriodDate} - ${p.endPeriodDate || "Actualidad"}<br>
      Partido: ${p.politicalParty}
    </div>
  `).join("");
}


async function loadRegions() {
  const container = document.getElementById("regions");
  container.innerHTML = "<h2>Regiones</h2><p>Cargando...</p>";
  const res = await fetch(`${API_BASE}/Region`);
  const data = await res.json();
  container.innerHTML = `<h2>Regiones</h2>` + data.map(r => `
    <div class="item"><strong>${r.name}</strong></div>
  `).join("");
}

async function loadAttractions() {
  const container = document.getElementById("attractions");
  container.innerHTML = "<h2>Atracciones turísticas</h2><p>Cargando...</p>";
  const res = await fetch(`${API_BASE}/TouristicAttraction`);
  const data = await res.json();
  container.innerHTML = `<h2>Atracciones</h2>` + data.map(a => `
    <div class="item"><strong>${a.name}</strong><br>${a.city?.name || ""}</div>
  `).join("");
}

async function loadCountry() {
  const container = document.getElementById("country");
  container.innerHTML = "<h2>Información del País</h2><p>Cargando...</p>";
  const res = await fetch(`${API_BASE}/Country/Colombia`);
  const data = await res.json();
  container.innerHTML = `
    <div class="item">
      <strong>${data.name}</strong><br>
      Capital: ${data.capital}<br>
      Población: ${data.population}<br>
      Superficie: ${data.surface}<br>
      Independencia: ${data.independenceDate}
    </div>
  `;
}

loadDepartments();
