const videoElements = document.querySelectorAll('#videos .video');
const featuredContainer = document.getElementById('featured');
const galleryContainer = document.getElementById('gallery');
const videoList = [];

if (videoElements.length > 0) {
  const allVideos = Array.from(videoElements);
  const latest = allVideos[0]; // primeiro da lista (mais recente)

  // Exibe o destaque
  featuredContainer.innerHTML = `
    <div class="featured">
      <img src="${latest.dataset.src}" alt="${latest.dataset.title}">
      <div class="featured-info">
        <h2>LAST VIDEO (FEATURED)</h2>
        <p>${latest.dataset.title}</p>
        <button onclick="alert('Abrir vídeo: ${latest.dataset.title}')">ASSISTIR</button>
      </div>
    </div>
  `;

  // Exibe todos os vídeos na galeria (inclusive o mais recente)
  allVideos.forEach(video => {
    const div = document.createElement('div');
    div.classList.add('gallery-item');
    div.dataset.title = video.dataset.title.toLowerCase(); // para busca
    div.innerHTML = `
      <img src="${video.dataset.thumb}" alt="${video.dataset.title}">
      <p>${video.dataset.title}</p>
    `;
    videoList.push(div);
    galleryContainer.appendChild(div);
  });
}

// === Lógica da lupa e busca ===
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