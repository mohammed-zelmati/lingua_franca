from flask import Flask, render_template, request, jsonify
from googletrans import Translator, LANGUAGES
import os

app = Flask(__name__)
translator = Translator()

@app.route('/')
def index():
    return render_template('index.html', languages=LANGUAGES)

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    text = data.get('text', '')
    source_lang = data.get('source_lang', 'auto')
    target_lang = data.get('target_lang', 'en')

    try:
        translation = translator.translate(text, src=source_lang, dest=target_lang)
        return jsonify({
            'translated_text': translation.text,
            'detected_lang': translation.src if source_lang == 'auto' else source_lang
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)