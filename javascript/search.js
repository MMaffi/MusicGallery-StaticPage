// Lógica da lupa e busca
const searchInput = document.getElementById('searchInput');
const searchToggle = document.getElementById('searchToggle');

searchToggle.addEventListener('click', () => {
	searchInput.style.display = searchInput.style.display === 'block' ? 'none' : 'block';
	if (searchInput.style.display === 'block') {
		searchInput.focus();
	}
});

document.addEventListener('click', (e) => {
	if (!searchInput.contains(e.target) && !searchToggle.contains(e.target)) {
		if (searchInput.value.trim() === '') {
		searchInput.style.display = 'none';
		}
	}
});

searchInput.addEventListener('input', () => {
	const query = searchInput.value.toLowerCase();
	galleryContainer.innerHTML = '';
	videoList.forEach(item => {
		if (item.dataset.title.includes(query)) {
		galleryContainer.appendChild(item);
		}
	});
});