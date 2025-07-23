// Player de vídeo com iframe (para YouTube)
function playVideo(src, title, date = '') {
	const modal = document.getElementById('player-modal');
	const video = document.getElementById('videoPlayer');
	const videoTitle = document.getElementById('player-title');
	const videoDate = document.getElementById('player-date');

	videoTitle.textContent = title;
	videoDate.textContent = date;
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