const THEMES = [
  { id: "rose-pink", name: "Rose Pink", color: "#e56b92" },
  { id: "hot-pink", name: "Hot Pink", color: "#ff4da6" },
  { id: "red", name: "Red", color: "#ff3b3b" },
  { id: "orange", name: "Orange", color: "#ff7a1a" },
  { id: "yellow", name: "Yellow", color: "#f5c518" },
  { id: "green", name: "Green", color: "#22c55e" },
  { id: "blue", name: "Blue", color: "#3b82f6" },
  { id: "purple", name: "Purple", color: "#a855f7" }
];
const DEFAULTS = { theme: "rose-pink", motion: false };
let settings = loadSettings();

function loadSettings() {
  try {
    const saved = { ...DEFAULTS, ...JSON.parse(localStorage.getItem("cuemoo-settings") || "{}") };
    if (!THEMES.some(t => t.id === saved.theme)) saved.theme = DEFAULTS.theme;
    return { theme: saved.theme, motion: !!saved.motion };
  } catch { return { ...DEFAULTS }; }
}
function saveSettings() {
  try { localStorage.setItem("cuemoo-settings", JSON.stringify(settings)); } catch {}
}
function applySettings() {
  document.documentElement.setAttribute("data-theme", settings.theme);
  document.documentElement.setAttribute("data-motion", settings.motion ? "off" : "on");
  const motion = document.getElementById("toggle-motion");
  if (motion) motion.checked = settings.motion;
  saveSettings();
}
function renderThemes() {
  const grid = document.getElementById("theme-grid");
  if (!grid) return;
  grid.replaceChildren();
  THEMES.forEach(theme => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-btn" + (settings.theme === theme.id ? " active" : "");
    const circle = document.createElement("span");
    circle.className = "theme-circle";
    circle.style.background = "linear-gradient(90deg, " + theme.color + " 50%, #000 50%)";
    const label = document.createElement("span");
    label.textContent = theme.name;
    button.append(circle, label);
    button.addEventListener("click", () => {
      settings.theme = theme.id;
      applySettings();
      renderThemes();
    });
    grid.append(button);
  });
}
document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(item => item.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const tab = document.getElementById(button.dataset.tab);
    if (tab) tab.classList.add("active");
  });
});
const motionToggle = document.getElementById("toggle-motion");
if (motionToggle) motionToggle.addEventListener("change", () => {
  settings.motion = motionToggle.checked;
  applySettings();
});
const reset = document.getElementById("reset-settings");
if (reset) reset.addEventListener("click", () => {
  settings = { ...DEFAULTS };
  applySettings();
  renderThemes();
});
applySettings();
renderThemes();
