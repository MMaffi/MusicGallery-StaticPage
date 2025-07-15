const videoElements = document.querySelectorAll('#videos .video');
const featuredContainer = document.getElementById('featured');
const galleryContainer = document.getElementById('gallery');
const videoList = [];

if (videoElements.length > 0) {
  const allVideos = Array.from(videoElements);
  const latest = allVideos[0]; // primeiro da lista (mais recente)

  // Destaque principal
  featuredContainer.innerHTML = `
    <div class="featured">
      <img src="${latest.dataset.thumb}" alt="${latest.dataset.title}">
      <div class="featured-info">
        <h2>LAST VIDEO (FEATURED)</h2>
        <p>${latest.dataset.title}</p>
        <button onclick="playVideo('${latest.dataset.src}', '${latest.dataset.title}')">ASSISTIR</button>
      </div>
    </div>
  `;

  // Galeria de vídeos
  allVideos.forEach(video => {
    const div = document.createElement('div');
    div.classList.add('gallery-item');
    div.dataset.title = video.dataset.title.toLowerCase();
    div.innerHTML = `
      <img src="${video.dataset.thumb}" alt="${video.dataset.title}">
      <p>${video.dataset.title}</p>
      <button onclick="playVideo('${video.dataset.src}', '${video.dataset.title}')">ASSISTIR</button>
    `;
    videoList.push(div);
    galleryContainer.appendChild(div);
  });
}

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

// Player de vídeo com iframe (para YouTube)
function playVideo(src, title) {
  const modal = document.getElementById('player-modal');
  const video = document.getElementById('videoPlayer');
  const videoTitle = document.getElementById('player-title');

  videoTitle.textContent = title;
  video.src = src;
  modal.style.display = 'block';
}

function closePlayer() {
  const modal = document.getElementById('player-modal');
  const video = document.getElementById('videoPlayer');

  video.src = ''; // Para o vídeo
  modal.style.display = 'none';
}