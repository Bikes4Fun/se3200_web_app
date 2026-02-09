const shuffleBtn = document.querySelector("#shuffleBtn");
const filtersBtn = document.querySelector("#filtersBtn");
const filters = document.querySelector("#filters");

const q = document.querySelector("#q");
const minYear = document.querySelector("#minYear");
const maxYear = document.querySelector("#maxYear");

const statusPill = document.querySelector("#statusPill");
const errorEl = document.querySelector("#error");
const result = document.querySelector("#result");

let scores = [];

const accents = [
  ["#75f", "#2ee"],
  ["#f46", "#fc6"],
  ["#6eb", "#6af"],
  ["#f7b", "#a8f"],
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

function theme() {
  const [a, b] = rand(accents);
  document.documentElement.style.setProperty("--accent", a);
  document.documentElement.style.setProperty("--accent2", b);
}

function pool() {
  const text = (q.value || "").toLowerCase().trim();
  const min = parseInt(minYear.value, 10);
  const max = parseInt(maxYear.value, 10);

  return scores.filter((s) => {
    const y = Number(s.year);
    if (!Number.isNaN(min) && y < min) return false;
    if (!Number.isNaN(max) && y > max) return false;
    if (!text) return true;
    return `${s.title} ${s.composer} ${s.year}`.toLowerCase().includes(text);
  });
}

function render(s) {
  result.innerHTML = "";

  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="cardTop">
      <div>
        <h2 class="title">${s.title}</h2>
        <div class="meta">${s.composer}</div>
      </div>
      <span class="badge">${s.year}</span>
    </div>

    <div class="player">
      <iframe
        title="${s.title} soundtrack"
        loading="lazy"
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        src="https://www.youtube.com/embed/${s.youtubeId}?rel=0">
      </iframe>
    </div>
  `;
  result.appendChild(card);
}

function shuffle() {
  errorEl.classList.add("hidden");

  const p = pool();
  statusPill.textContent = `${p.length}/${scores.length} match filters`;

  if (!p.length) {
    errorEl.textContent = "No matches";
    errorEl.classList.remove("hidden");
    return;
  }

  theme();
  render(rand(p));
}

fetch("filmscores.json")
  .then((r) => r.json())
  .then((data) => {
    scores = data;
    shuffleBtn.disabled = false;
    statusPill.textContent = `${scores.length}/${scores.length} match filters`;
  })
  .catch(() => {
    statusPill.textContent = "Load failed";
    errorEl.textContent = "Could not load filmscores.json (use a local server)";
    errorEl.classList.remove("hidden");
  });

// events
shuffleBtn.addEventListener("click", shuffle);
filtersBtn.addEventListener("click", () => filters.classList.toggle("hidden"));
[q, minYear, maxYear].forEach((el) => el.addEventListener("input", shuffle));

theme();
