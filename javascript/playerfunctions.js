// Player de vídeo com iframe (para YouTube)
function playVideo(src, title, date = '', views = '') {
	const modal = document.getElementById('player-modal');
	const video = document.getElementById('videoPlayer');
	const videoTitle = document.getElementById('player-title');
	const videoDate = document.getElementById('player-date');
	const videoViews = document.getElementById('player-views');

	videoTitle.textContent = title;
	videoDate.textContent = date;

	const viewsText = translations?.global?.views || 'visualizações';
    videoViews.textContent = views ? `${formatViews(views)} ${viewsText}` : '';
	
	video.src = src;
  	modal.style.display = 'block';
	document.body.classList.add("modal-open");
}

function closePlayer() {
	const modal = document.getElementById('player-modal');
	const video = document.getElementById('videoPlayer');

	video.src = '';
	modal.style.display = 'none';
	document.body.classList.remove("modal-open");
}