const searchInput = document.getElementById('searchInput');
const searchToggle = document.getElementById('searchToggle');

function resetSearchLayout() {
	const featured = document.getElementById('featured');
	const subtitle = document.getElementById('gallerySubtitle');
	const gallery = document.getElementById('gallery');
	const query = searchInput.value.trim();

	if (featured) featured.style.display = 'flex';
	if (subtitle) subtitle.style.display = 'block';
	if (gallery) gallery.style.marginTop = '0';

	if (query !== '') {
		searchInput.value = '';

		const isHomePage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html');
		const isVideosPage = window.location.pathname.endsWith('/videos.html');

		galleryContainer.innerHTML = '';
		if (isHomePage) {
			window.allVideos.slice(1, currentIndex).forEach(video => addVideoToGallery(video));
			addSeeMoreCard();
		} else if (isVideosPage) {
			window.allVideos.slice(0, currentIndex).forEach(video => addVideoToGallery(video));
		} else {
			window.allVideos.forEach(video => addVideoToGallery(video));
		}
	}
}

searchToggle.addEventListener('click', () => {
	const isActive = searchInput.classList.toggle('active');
	if (isActive) {
		searchInput.focus();
	} else {
		resetSearchLayout();
	}
});

document.addEventListener('click', (e) => {
	if (!searchInput.contains(e.target) && !searchToggle.contains(e.target)) {
		if (searchInput.value.trim() === '') {
			searchInput.classList.remove('active');
			resetSearchLayout();
		}
	}
});

document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		searchInput.classList.remove('active');
		resetSearchLayout();
	}
});

// Código da busca

let fuse;

const waitForVideos = setInterval(() => {
	if (window.allVideos && typeof Fuse !== 'undefined') {
		clearInterval(waitForVideos);

		console.log("Fuse inicializado com", window.allVideos.length, "vídeos");

		fuse = new Fuse(window.allVideos, {
			keys: ['title'],
			threshold: 0.5,
			includeScore: true
		});

		searchInput.addEventListener('input', () => {
			const query = searchInput.value.trim();
			console.log("Busca:", query);

			const featured = document.getElementById('featured');
			const subtitle = document.getElementById('gallerySubtitle');
			const gallery = document.getElementById('gallery');

			if (query !== '') {
				if (featured) featured.style.display = 'none';
				if (subtitle) subtitle.style.display = 'none';
				if (gallery) gallery.style.marginTop = '-30px';
			} else {
				if (featured) featured.style.display = 'flex';
				if (subtitle) subtitle.style.display = 'block';
				if (gallery) gallery.style.marginTop = '0';
			}

			galleryContainer.innerHTML = '';
			videoList.length = 0;

			if (query === '') {
				const isHomePage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html');
				const isVideosPage = window.location.pathname.endsWith('/videos.html');

				if (isHomePage) {
					window.allVideos.slice(1, currentIndex).forEach(video => addVideoToGallery(video));
					addSeeMoreCard();
				} else if (isVideosPage) {
					window.allVideos.slice(0, currentIndex).forEach(video => addVideoToGallery(video));
				} else {
					window.allVideos.forEach(video => addVideoToGallery(video));
				}
				return;
			}

			const results = fuse.search(query);
			console.log("Resultados:", results.length);
			results.forEach(result => {
				addVideoToGallery(result.item);
			});
		});
	}
}, 100);