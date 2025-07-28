function showToast(message, duration = 3000, type = 'info') {
	const toast = document.createElement('div');
	toast.className = `toast ${type}`;
	toast.textContent = message;

	const progress = document.createElement('div');
	progress.className = 'progress-bar';
	toast.appendChild(progress);

	document.body.appendChild(toast);

	let startTime = Date.now();
	let elapsed = 0;
	let widthPercent = 100;
	let paused = false;

	const intervalMs = 10;

	function updateProgress() {
		if (!paused) {
			elapsed = Date.now() - startTime;
			widthPercent = Math.max(0, 100 - (elapsed / duration) * 100);
			progress.style.width = widthPercent + '%';

			if (elapsed >= duration) {
				clearInterval(intervalId);
				toast.remove();
			}
		}
	}

	const intervalId = setInterval(updateProgress, intervalMs);

	toast.addEventListener('mouseenter', () => {
		paused = true;
	});

	toast.addEventListener('mouseleave', () => {
		paused = false;
		startTime = Date.now() - elapsed;
	});
}