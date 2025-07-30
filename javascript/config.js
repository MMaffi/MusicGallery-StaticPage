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

// Toggle visibilidade do dropdown
selectedTheme.addEventListener("click", () => {
    themeOptions.style.display = themeOptions.style.display === "block" ? "none" : "block";
});

// Seleção de tema
themeOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        const theme = option.dataset.theme;

        // Atualiza botão
        selectedTheme.querySelector("span").textContent = option.textContent;

        // Aplica o tema no body
        document.body.classList.remove("light-theme", "dark-theme");
        document.body.classList.add(theme + "-theme");

        // Salva no localStorage
        localStorage.setItem("theme", theme);

        // Fecha o dropdown
        themeOptions.style.display = "none";
    });
});

// Fecha o dropdown se clicar fora
document.addEventListener("click", (e) => {
    if (!selectedTheme.contains(e.target) && !themeOptions.contains(e.target)) {
        themeOptions.style.display = "none";
    }
});

// Aplica o tema salvo ao carregar
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(savedTheme + "-theme");

    const themeButton = document.getElementById("selectedTheme");
    if (themeButton) {
        themeButton.querySelector("span").textContent =
            savedTheme.charAt(0).toUpperCase() + savedTheme.slice(1);
    }
});
