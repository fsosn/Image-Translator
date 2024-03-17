import cv2
import easyocr
import numpy as np
import base64


def init_reader(from_lang):
    return easyocr.Reader([from_lang.lower()], gpu=False)


def read_image(file):
    nparr = np.frombuffer(file.read(), np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)


def draw_bounding_boxes(img, text_results):
    for bbox, text, score in text_results:
        if score > 0.2:
            bbox = np.array(bbox, dtype=np.int32)
            cv2.rectangle(img, tuple(bbox[0]), tuple(bbox[2]), (0, 255, 0), 2)

            text_position = (bbox[0][0], bbox[0][1] - 3)
            font = cv2.FONT_HERSHEY_SIMPLEX
            font_scale = 0.5
            font_color = (255, 255, 255)
            line_thickness = 1

            text_size, _ = cv2.getTextSize(text, font, font_scale, line_thickness)
            cv2.rectangle(
                img,
                (bbox[0][0], bbox[0][1] - text_size[1] - 3),
                (bbox[0][0] + text_size[0], bbox[0][1]),
                (0, 0, 0),
                -1,
            )

            cv2.putText(
                img, text, text_position, font, font_scale, font_color, line_thickness
            )

    return img


def encode_image(img):
    _, buffer = cv2.imencode(".jpg", img)
    return base64.b64encode(buffer).decode("utf-8")


def detect_text(reader, img):
    return reader.readtext(img)
