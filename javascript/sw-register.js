if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/javascript/service-worker.js')
    .then(() => console.log('✅ Service Worker registrado!'))
    .catch(err => console.error('❌ Erro ao registrar SW:', err));
}