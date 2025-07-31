// Script para abrir modal
document.getElementById('configBtn').addEventListener('click', () => {
	toggleSettings(true);
});

function toggleSettings(show) {
	const modal = document.getElementById('settings-modal');
	modal.classList.toggle('active', show);
}

// Função para abrir dorpdown de idiomas
const langData = {
    pt: { label: "Português", flag: "./assets/flags/br.svg" },
    en: { label: "English", flag: "./assets/flags/us.svg" },
    es: { label: "Español", flag: "./assets/flags/es.svg" }
};

const dropdown = document.querySelector('.language-dropdown');
const toggle = document.getElementById('selectedLang');
const options = document.querySelectorAll('.dropdown-options li');

toggle.addEventListener('click', () => {
    dropdown.classList.toggle('open');
});

options.forEach(option => {
    option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        const img = option.querySelector('img').src;
        const label = option.querySelector('span').textContent;

        toggle.innerHTML = `<img src="${img}" alt="flag"><span>${label}</span>`;

        dropdown.classList.remove('open');

        localStorage.setItem('lang', lang);

        setLanguage(lang);
    });
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang') || 'pt';

    const { label, flag } = langData[savedLang];

    toggle.innerHTML = `<img src="${flag}" alt="flag"><span>${label}</span>`;

    setLanguage(savedLang);
});

// Função para limpar histórico
function clearHistory() {
	localStorage.removeItem('searchHistory');
	searchHistory = [];

	suggestions.style.display = 'none';

	const message = translations?.toasts?.clearHistory || "Histórico limpo com sucesso!";
	showToast(message, 4000, "success");
}

// Light Mode
const selectedTheme = document.getElementById("selectedTheme");
const themeOptions = selectedTheme.nextElementSibling;

function applyTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");

    if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.body.classList.add(prefersDark ? "dark-theme" : "light-theme");
    } else {
        document.body.classList.add(`${theme}-theme`);
    }
}

function updateThemeButtonLabel() {
    const theme = localStorage.getItem("theme") || "system";
    const label = translations?.global?.themes?.[theme];

    if (label) {
        selectedTheme.querySelector("span").textContent = label;
    }
}

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", () => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "system") {
        applyTheme("system");
    }
});

selectedTheme.addEventListener("click", () => {
    themeOptions.style.display = themeOptions.style.display === "block" ? "none" : "block";
});

themeOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        const theme = option.dataset.theme;

        localStorage.setItem("theme", theme);
        applyTheme(theme);

        updateThemeButtonLabel();

        themeOptions.style.display = "none";
    });
});

// Fecha dropdown se clicar fora
document.addEventListener("click", (e) => {
    if (!selectedTheme.contains(e.target) && !themeOptions.contains(e.target)) {
        themeOptions.style.display = "none";
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "system";
    applyTheme(savedTheme);
});