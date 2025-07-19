const isHomePage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html');
const isVideosPage = window.location.pathname.endsWith('/videos.html');

const galleryContainer = document.getElementById('gallery');
const videoList = [];
let allVideos = [];
let currentIndex = 0;

const batchSize = isHomePage ? 18 : isVideosPage ? 24 : 18;

const apiKey = 'AIzaSyBs6PS2RkjkXlcrTDz9760GPEgta73CTX8';
const playlistId = 'UU0HmTxJ5o42rXrR85VYfXvg';

function fetchVideos(pageToken = '', accumulated = []) {
	const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}&pageToken=${pageToken}`;

	return fetch(url)
		.then(res => res.json())
		.then(data => {
			if (!data.items || data.items.length === 0) {
				console.warn('Nenhum vídeo encontrado no canal.');
				document.getElementById('gallery').innerHTML = `
				<p style="text-align:center; color:#fff; font-size:1.2rem;">
					Nenhum vídeo publicado no canal ainda. Volte em breve! 🎵
				</p>`;
				return [];
			}

			const newVideos = data.items.map(item => ({
				title: item.snippet.title,
				thumb: item.snippet.thumbnails.medium.url,
				src: `https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`
			}));

			const combined = [...accumulated, ...newVideos];

			if (data.nextPageToken) {
				return fetchVideos(data.nextPageToken, combined);
			} else {
				return combined;
			}
		});
}

// Início do carregamento
fetchVideos()
	.then(videos => {
		allVideos = videos;
		window.allVideos = videos;

		if (allVideos.length === 0) return;

		if (isHomePage) {
		const featuredContainer = document.getElementById('featured');
		const latest = allVideos[0];

		featuredContainer.innerHTML = `
			<div class="featured" style="background-image: url('${latest.thumb}');">
			<div class="featured-info">
				<h2>Vídeo em Destaque</h2>
				<p>${latest.title}</p>
				<button onclick="playVideo('${latest.src}', '${latest.title}')">ASSISTIR</button>
			</div>
			</div>
		`;

		currentIndex = 1;
		loadMoreVideos(true);
		} else if (isVideosPage) {
		loadMoreVideos();
		window.addEventListener('scroll', () => {
			const scrollTop = window.scrollY;
			const windowHeight = window.innerHeight;
			const docHeight = document.documentElement.scrollHeight;

			if (scrollTop + windowHeight >= docHeight - 100) {
			loadMoreVideos();
			}
		});
		} else {
		allVideos.forEach(video => addVideoToGallery(video));
		}
	})
	.catch(err => console.error('Erro ao carregar vídeos:', err));

function loadMoreVideos(limited = false) {
	let nextVideos;
	if (limited) {
		nextVideos = allVideos.slice(currentIndex, batchSize + 1);
	} else {
		nextVideos = allVideos.slice(currentIndex, currentIndex + batchSize);
	}

	nextVideos.forEach(video => addVideoToGallery(video));
	currentIndex += nextVideos.length;

	if (limited && currentIndex >= batchSize) {
		addSeeMoreCard();
	}
}

function addVideoToGallery(video) {
	const div = document.createElement('div');
	div.classList.add('gallery-item');
	div.dataset.title = video.title.toLowerCase();
	div.innerHTML = `
		<img src="${video.thumb}" alt="${video.title}">
		<p>${video.title}</p>
	`;
	div.addEventListener('click', () => {
		playVideo(video.src, video.title);
	});
	videoList.push(div);
	galleryContainer.appendChild(div);
}

function addSeeMoreCard() {
	const div = document.createElement('div');
	div.classList.add('gallery-item', 'see-more-card');
	div.textContent = 'Veja mais vídeos aqui';
	div.addEventListener('click', () => {
		window.location.href = 'videos.html';
	});
	galleryContainer.appendChild(div);
}