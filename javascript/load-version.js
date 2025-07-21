fetch('./json/version.json')
    .then(response => {
        if (!response.ok) {
        throw new Error('Erro ao carregar versão');
        }
        return response.json();
    })
    .then(data => {
        const versionElement = document.getElementById('siteVersion');
        if (versionElement) {
        versionElement.textContent = data.version;
        }
    })
    .catch(error => {
        console.error('Erro ao carregar a versão do site:', error);
});