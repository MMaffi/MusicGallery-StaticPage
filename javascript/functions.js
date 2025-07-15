function playVideo(src, title) {
  const playerSection = document.getElementById('player');
  const video = document.getElementById('videoPlayer');
  const videoTitle = document.getElementById('player-title');

  video.src = src;
  videoTitle.textContent = title;
  playerSection.style.display = 'block';

  // Scroll até o player
  playerSection.scrollIntoView({ behavior: 'smooth' });
}

function closePlayer() {
  const playerSection = document.getElementById('player');
  const video = document.getElementById('videoPlayer');
  video.pause();
  video.currentTime = 0;
  video.src = '';
  playerSection.style.display = 'none';
}