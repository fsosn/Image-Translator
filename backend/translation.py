import os
import deepl
from dotenv import load_dotenv

load_dotenv()

DEEPL_AUTH_KEY = os.getenv("DEEPL_AUTH_KEY")
translator = deepl.Translator(DEEPL_AUTH_KEY)


def translate(text, to_lang):
    return translator.translate_text(text, target_lang=to_lang).text
