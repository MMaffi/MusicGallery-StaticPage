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
const dropdownOptions = document.querySelector('.dropdown-options');

toggle.addEventListener('click', () => {
    dropdown.classList.toggle('open');
});

dropdownOptions.addEventListener('click', (event) => {
    const option = event.target.closest('li');
    if (!option) return;

    const lang = option.getAttribute('data-lang');
    const imgElement = option.querySelector('img');
    const spanElement = option.querySelector('span');

    if (!imgElement || !spanElement) {
        console.warn('Elemento img ou span não encontrado dentro do li');
        return;
    }

    toggle.innerHTML = `<img src="${imgElement.src}" alt="flag"><span>${spanElement.textContent}</span>`;

    dropdown.classList.remove('open');

    localStorage.setItem('lang', lang);

    setLanguage(lang);
});

// Fecha dropdown se clicar fora
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
    const icons = {
        dark: "🌙",
        light: "☀️",
        system: "🖥️"
    };

    if (label) {
        selectedTheme.querySelector("span").textContent = `${icons[theme]} ${label}`;
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