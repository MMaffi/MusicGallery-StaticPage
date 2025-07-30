const isHomePage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html');
const isVideosPage = window.location.pathname.endsWith('/videos.html');

const galleryContainer = document.getElementById('gallery');
const videoList = [];
let allVideos = [];
let currentIndex = 0;

const batchSize = isHomePage ? 19 : isVideosPage ? 60 : 19;

// Colocar Restrições na API
const apiKey = 'AIzaSyBs6PS2RkjkXlcrTDz9760GPEgta73CTX8';
const playlistId = 'UU0HnTxJ5o42rXrR85VYfXVg';

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
				src: `https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`,
				videoId: item.snippet.resourceId.videoId,
				publishedAt: item.snippet.publishedAt
			}));

			const combined = [...accumulated, ...newVideos];

			if (data.nextPageToken) {
				return fetchVideos(data.nextPageToken, combined);
			} else {
				return combined;
			}
		});
}

function fetchVideoDetails(videoIds) {
	const ids = videoIds.join(',');
	const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${apiKey}`;

	return fetch(url)
		.then(res => res.json())
		.then(data => {
			const statsMap = {};
			if (data.items) {
				data.items.forEach(item => {
					statsMap[item.id] = item.statistics.viewCount || 0;
				});
			}
			return statsMap;
		});
}

// Função para teste
// function fetchVideos() {
// 	const fakeVideos = [];

// 	for (let i = 1; i <= 200; i++) {
// 		fakeVideos.push({
// 			title: `Vídeo de Teste ${i}`,
// 			thumb: `https://via.placeholder.com/320x180.png?text=Thumb+${i}`,
// 			src: `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&fake=${i}`,
// 			publishedAt: new Date(2024, 0, i % 30 + 1).toISOString()
// 		});
// 	}

// 	return Promise.resolve(fakeVideos);
// }

// Início do carregamento
fetchVideos()
	.then(videos => {
		const videoIds = videos.map(v => v.videoId);
		return fetchVideoDetails(videoIds)
			.then(statsMap => {
				// Junta as views em cada vídeo
				videos.forEach(v => {
					v.views = statsMap[v.videoId] || '0';
				});
				return videos;
			});
	})
	.then(videos => {
		allVideos = videos;
		window.allVideos = videos;

		if (allVideos.length === 0) return;

		if (isHomePage) {
		const featuredContainer = document.getElementById('featured');

		const randomIndex = Math.floor(Math.random() * allVideos.length);
		const latest = allVideos[randomIndex];

		featuredContainer.innerHTML = `
			<div class="featured" style="background-image: url('${latest.thumb}');">
				<div class="featured-info">
					<h2 data-i18n="index.featured">Vídeo em Destaque</h2>
					<p>${latest.title}</p>
					<button id="btn-play-featured" data-i18n="index.btnwatch">ASSISTIR</button>
				</div>
			</div>
		`;

		translateNewContent();

		document.getElementById('btn-play-featured').addEventListener('click', () => {
			playVideo(latest.src, latest.title, formatDate(latest.publishedAt), latest.views);
		});

		currentIndex = 0;
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
		<p class="video-title">${video.title}</p>
	`;
	
	div.addEventListener('click', () => {
		playVideo(video.src, video.title, formatDate(video.publishedAt), video.views);
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };

    const localeMap = {
        pt: 'pt-BR',
        en: 'en-US',
		es: 'es-ES'
    };

    const locale = localeMap[currentLang] || 'pt-BR';
    return date.toLocaleDateString(locale, options);
}

function formatViews(views) {
    views = Number(views);
    if (views >= 1_000_000) {
        return (views / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } 
    if (views >= 1_000) {
        return (views / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return views.toString();
}

const links = document.querySelectorAll('.menu a');
const currentPage = location.pathname.split('/').pop();

links.forEach(link => {
	const href = link.getAttribute('href');
	if (href === currentPage || (currentPage === '' && href === 'index.html')) {
		link.classList.add('active');
	}
});

// Atualiza sininho da notificação ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
	updateNotificationIcon();
});