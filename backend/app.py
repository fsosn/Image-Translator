from flask import Flask, request, jsonify
from flask_cors import CORS
from image_processing import read_image, draw_bounding_boxes, encode_image, init_reader
from translation import translate

app = Flask(__name__)
CORS(app)


@app.route("/process_and_translate", methods=["POST"])
def process_and_translate():
    from_lang = request.form.get("from")
    to_lang = request.form.get("to")

    reader = init_reader(from_lang)

    file = request.files["file"]
    img = read_image(file)

    text_results = reader.readtext(img)
    detected_text = " ".join([text for _, text, score in text_results if score > 0.2])

    img_with_bboxes = draw_bounding_boxes(img.copy(), text_results)

    translated_text = translate(detected_text, to_lang)

    img_encoded = encode_image(img_with_bboxes)

    return jsonify(
        {
            "image": img_encoded,
            "text": detected_text,
            "translated_text": translated_text,
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
