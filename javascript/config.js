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