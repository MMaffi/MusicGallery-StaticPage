let currentLang = localStorage.getItem("lang") || "pt";

let translations = {};

function setLanguage(lang) {
    currentLang = lang;
    fetch(`./locales/${lang}.json`)
        .then(res => res.json())
        .then(data => {
            translations = data;

            document.querySelectorAll("[data-i18n]").forEach(el => {
                const keys = el.getAttribute("data-i18n").split(".");
                let text = translations;
                keys.forEach(key => text = text?.[key]);
                if (text) {
                    if (el.dataset.i18nHtml === "true") {
                        el.innerHTML = text;
                    } else {
                        el.textContent = text;
                    }
                }
            });

            // Placeholder de busca
            const input = document.querySelector("#searchInput");
            if (input && translations.global.searchPlaceholder) {
                input.placeholder = translations.global.searchPlaceholder;
            }

            // Title translations
            document.querySelectorAll("[data-i18n-title]").forEach(el => {
                const key = el.getAttribute("data-i18n-title");
                const translated = translations?.[key];
                if (translated) el.title = translated;
            });

            // Define título da aba
            const currentPage = window.location.pathname.includes('videos') ? 'videos' :
                                window.location.pathname.includes('sobre') ? 'about' :
                                window.location.pathname.includes('sugestoes') ? 'suggestions' :
                                window.location.pathname.includes('thankyou') ? 'thankyou' : 'index';

            const pageTitle = resolveNestedKey(translations, `${currentPage}.meta.title`);
            if (pageTitle) document.title = pageTitle;

            localStorage.setItem("lang", lang);

        });
}

document.getElementById("languageSelect")?.addEventListener("change", (e) => {
    setLanguage(e.target.value);
});

setLanguage(currentLang);

const langSelect = document.getElementById("languageSelect");
if (langSelect) {
    langSelect.value = currentLang;
}

function translateNewContent() {
    const lang = localStorage.getItem("lang") || "pt";
    setLanguage(lang);
}

function resolveNestedKey(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}