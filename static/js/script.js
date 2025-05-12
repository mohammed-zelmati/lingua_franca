document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const sourceLang = document.getElementById('source-lang');
    const targetLang = document.getElementById('target-lang');
    const detectedLang = document.getElementById('detected-lang');

    let debounceTimeout;

    const translateText = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            const text = inputText.value.trim();
            if (!text) {
                outputText.value = '';
                detectedLang.textContent = '';
                return;
            }

            try {
                const response = await fetch('/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text,
                        source_lang: sourceLang.value,
                        target_lang: targetLang.value
                    })
                });

                const data = await response.json();
                if (data.error) {
                    outputText.value = 'Erreur : ' + data.error;
                    return;
                }

                outputText.value = data.translated_text;
                if (sourceLang.value === 'auto') {
                    const langName = sourceLang.querySelector(`option[value="${data.detected_lang}"]`).textContent;
                    detectedLang.textContent = `Langue détectée : ${langName}`;
                } else {
                    detectedLang.textContent = '';
                }
            } catch (error) {
                outputText.value = 'Erreur de connexion au serveur';
            }
        }, 300);
    };

    inputText.addEventListener('input', translateText);
    sourceLang.addEventListener('change', translateText);
    targetLang.addEventListener('change', translateText);
});