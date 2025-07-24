const searchInput = document.getElementById('searchInput');
const searchToggle = document.getElementById('searchToggle');
const suggestions = document.getElementById('suggestions');

let debounceTimer;
let selectedIndex = -1;
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

function resetSearchLayout() {
	const featured = document.getElementById('featured');
	const subtitle = document.getElementById('gallerySubtitle');
	const gallery = document.getElementById('gallery');

	if (featured) featured.style.display = 'flex';
	if (subtitle) subtitle.style.display = 'block';
	if (gallery) gallery.style.marginTop = '0';

	searchInput.value = '';
	suggestions.innerHTML = '';
	suggestions.style.display = 'none';
	galleryContainer.innerHTML = '';
	videoList.length = 0;

	const isHome = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html');
	const isVideos = window.location.pathname.endsWith('/videos.html');

	if (isHome) {
		const visibleVideos = window.allVideos.slice(0, currentIndex);
		visibleVideos.forEach(video => addVideoToGallery(video));

		if (window.allVideos.length > currentIndex) {
			addSeeMoreCard();
		}
	} else if (isVideos) {
		window.allVideos.slice(0, currentIndex).forEach(video => addVideoToGallery(video));
	} else {
		window.allVideos.forEach(video => addVideoToGallery(video));
	}
}

searchToggle.addEventListener('click', () => {
	searchInput.classList.add('active');
	searchInput.focus();
	updateSuggestions(searchInput.value);
});

document.addEventListener('click', (e) => {
	const isClickOutside = !searchInput.contains(e.target) && !searchToggle.contains(e.target) && !suggestions.contains(e.target);

	if (isClickOutside) {
		suggestions.style.display = 'none';

		if (searchInput.classList.contains('active') && searchInput.value.trim() === '') {
			searchInput.classList.remove('active');
			resetSearchLayout();
		}
	}
});

document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		searchInput.classList.remove('active');
		suggestions.style.display = 'none';
		resetSearchLayout();
	}
});

// Debounce para sugestões
searchInput.addEventListener('input', () => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => updateSuggestions(searchInput.value.trim()), 300);
});

// Sugestões (teclado)
searchInput.addEventListener('keydown', (e) => {
	const items = suggestions.querySelectorAll('.suggestion');
	if (e.key === 'ArrowDown') {
		selectedIndex = (selectedIndex + 1) % items.length;
		updateHighlight(items);
		e.preventDefault();
	} else if (e.key === 'ArrowUp') {
		selectedIndex = (selectedIndex - 1 + items.length) % items.length;
		updateHighlight(items);
		e.preventDefault();
	} else if (e.key === 'Enter') {
		e.preventDefault();
		if (selectedIndex >= 0 && items[selectedIndex]) {
			searchInput.value = items[selectedIndex].textContent;
			executeSearch(searchInput.value.trim());
			suggestions.style.display = 'none';
		} else {
			executeSearch(searchInput.value.trim());
			suggestions.style.display = 'none';
		}
	}
});

function updateHighlight(items) {
	items.forEach((el, i) => {
		el.classList.toggle('active', i === selectedIndex);
	});
}

function updateSuggestions(query) {
	suggestions.innerHTML = '';
	selectedIndex = -1;

	if (!query) {
		showRecentHistory();
		return;
	}

	const matches = allVideos.filter(v => v.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

	if (matches.length === 0) {
		suggestions.innerHTML = `<div class="no-match">Nenhuma sugestão encontrada</div>`;
		suggestions.style.display = 'block';
		return;
	}

	suggestions.innerHTML = matches.map(v =>
		`<div class="suggestion" data-title="${v.title}">${v.title}</div>`
	).join('');

	suggestions.style.display = 'block';
}

function showRecentHistory() {
	if (searchHistory.length === 0) {
		suggestions.style.display = 'none';
		return;
	}

	suggestions.innerHTML = searchHistory.slice(0, 5).map(h =>
		`<div class="suggestion" data-title="${h}">${h} <span style="opacity: 0.6;">(histórico)</span></div>`
	).join('');

	suggestions.innerHTML += `
		<div class="clear-history" style="text-align: center; color: #aaa; padding: 8px; cursor: pointer; border-top: 1px solid #444;">
			Limpar histórico
		</div>
	`;

	suggestions.style.display = 'block';
}

// Clique em sugestão
suggestions.addEventListener('click', (e) => {
	if (e.target && e.target.matches('div[data-title]')) {
		const title = e.target.getAttribute('data-title');
		searchInput.value = title;
		suggestions.style.display = 'none';
		executeSearch(title);
	}
});

// Clique para limpar histórico
suggestions.addEventListener('click', (e) => {
	if (e.target && e.target.matches('div[data-title]')) {
		const title = e.target.getAttribute('data-title');
		searchInput.value = title;
		suggestions.style.display = 'none';
		executeSearch(title);
	} else if (e.target && e.target.classList.contains('clear-history')) {
		localStorage.removeItem('searchHistory');
		searchHistory = [];
		suggestions.style.display = 'none';
	}
});

function executeSearch(query) {
	if (!query) return;

	addToSearchHistory(query);
	const featured = document.getElementById('featured');
	const subtitle = document.getElementById('gallerySubtitle');
	const gallery = document.getElementById('gallery');

	if (featured && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html')))
		featured.style.display = 'none';
	if (subtitle && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html')))
		subtitle.style.display = 'none';
	if (gallery && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html')))
		gallery.style.marginTop = '-30px';

	galleryContainer.innerHTML = '<p style="color:#ccc;text-align:center;">Buscando...</p>';
	videoList.length = 0;

	setTimeout(() => {
		const results = fuse.search(query);
		if (results.length === 0) {
			galleryContainer.innerHTML = `<p style="color:#ccc;text-align:center;">Nenhum vídeo encontrado.</p>`;
			return;
		}

		galleryContainer.innerHTML = '';
		results.forEach(result => addVideoToGallery(result.item));
		document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
	}, 200);
}

function addToSearchHistory(term) {
	if (!term) return;
	if (searchHistory.includes(term)) {
		searchHistory = searchHistory.filter(item => item !== term);
	}
	searchHistory.unshift(term);
	if (searchHistory.length > 10) searchHistory.pop();
	localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Fuse iniciar
let fuse;
const waitForVideos = setInterval(() => {
	if (window.allVideos && typeof Fuse !== 'undefined') {
		clearInterval(waitForVideos);
		fuse = new Fuse(window.allVideos, {
			keys: ['title'],
			threshold: 0.4,
			includeScore: true
		});
	}
}, 100);