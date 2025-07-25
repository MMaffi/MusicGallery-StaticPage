// Script para abrir modal
document.getElementById('configBtn').addEventListener('click', () => {
	toggleSettings(true);
});

function toggleSettings(show) {
	const modal = document.getElementById('settings-modal');
	modal.classList.toggle('active', show);
}

function clearHistory() {
	localStorage.removeItem('searchHistory');
	searchHistory = [];

	suggestions.style.display = 'none';

	alert('Histórico de busca limpo!');
}

// Light Mode
const themeSwitch = document.getElementById('themeSwitch');

themeSwitch.addEventListener('change', () => {
	document.body.classList.toggle('light-theme', themeSwitch.checked);
	localStorage.setItem('theme', themeSwitch.checked ? 'light' : 'dark');
});

window.addEventListener('DOMContentLoaded', () => {
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'light') {
		document.body.classList.add('light-theme');
		themeSwitch.checked = true;
	}
});