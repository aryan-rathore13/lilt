const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const toast = document.getElementById("toast");
let toastTimeout;

function announce(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 3500);
}

// Use the actual deployed origin so the installer works on a Vercel URL or a
// custom domain without hardcoding a domain the project does not own.
document.getElementById("install-command").textContent =
  `curl -fsSL ${location.origin}/install.sh | sh`;

for (const button of document.querySelectorAll("[data-copy]")) {
  button.addEventListener("click", async () => {
    const value = document.getElementById(button.dataset.copy).textContent;
    try {
      await navigator.clipboard.writeText(value);
      announce("Copied. Your terminal is up next.");
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById(button.dataset.copy));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      announce("Command selected. Press Ctrl+C or ⌘C to copy.");
    }
  });
}

function wireTabs(container, key, panelPrefix, onActivate) {
  const buttons = [...container.querySelectorAll('[role="tab"]')];
  const activate = (button) => {
    buttons.forEach((item) => {
      const active = item === button;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(panelPrefix + item.dataset[key]).hidden = !active;
    });
    onActivate?.(button.dataset[key]);
  };
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activate(button));
    button.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft")
        next = (index + buttons.length - 1) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      activate(buttons[next]);
      buttons[next].focus();
    });
  });
}

wireTabs(document.querySelector(".demo-tabs"), "tab", "panel-");
wireTabs(document.querySelector(".install-platforms"), "platform", "install-");

const sampleFiles = [
  ["greeting.tsx", "src/components"],
  ["greeting.test.tsx", "src/components"],
  ["button.tsx", "src/components"],
  ["index.ts", "src"],
  ["theme.css", "src/styles"],
  ["README.md", "."],
  ["package.json", "."],
];
const searchInput = document.getElementById("demo-search");
function renderSampleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  const results = sampleFiles.filter(([name, path]) => {
    const candidate = `${path}/${name}`.toLowerCase();
    let position = 0;
    for (const char of query) {
      position = candidate.indexOf(char, position);
      if (position === -1) return false;
      position++;
    }
    return true;
  });
  const container = document.getElementById("demo-search-results");
  container.replaceChildren();
  if (!results.length) {
    const empty = document.createElement("p");
    empty.className = "search-empty";
    empty.textContent =
      "No sample files found. Try “greet”, “btn”, or “readme”.";
    container.append(empty);
  }
  results.slice(0, 4).forEach(([name, path]) => {
    const row = document.createElement("div");
    row.className = "search-result";
    const fileName = document.createElement("span");
    fileName.textContent = `⌗  ${name}`;
    const filePath = document.createElement("span");
    filePath.textContent = path;
    row.append(fileName, filePath);
    container.append(row);
  });
}
searchInput.addEventListener("input", renderSampleSearch);
renderSampleSearch();

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  document.documentElement.classList.add("motion-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));
}
