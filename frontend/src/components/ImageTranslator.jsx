import { useState } from "react";
import axios from "axios";
import languages from "../utils/languages";

const ImageTranslator = () => {
  const [processedImage, setProcessedImage] = useState(null);
  const [detectedText, setDetectedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLanguage, setFromLanguage] = useState("EN");
  const [toLanguage, setToLanguage] = useState("PL");
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const endpoint = "http://localhost:5000/process_and_translate";

  const handleFromLanguageChange = (event) => {
    setFromLanguage(event.target.value);
  };

  const handleToLanguageChange = (event) => {
    setToLanguage(event.target.value);
  };

  const processImage = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("from", fromLanguage);
    formData.append("to", toLanguage);

    axios
      .post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setProcessedImage(response.data.image);
        setDetectedText(response.data.text);
        setTranslatedText(response.data.translated_text);
      })
      .catch((error) => {
        console.error("Error processing image:", error);
      });
  };

  const handleImageUpload = (event) => {
    setProcessedImage(null);
    setTranslatedText("");
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (event) => {
    setProcessedImage(null);
    setTranslatedText("");
    const items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    for (const item of items) {
      if (item.kind === "file") {
        const blob = item.getAsFile();
        setFile(blob);
        const reader = new FileReader();
        reader.onload = (e) => {
          setFileUrl(e.target.result);
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  const handleDrop = (event) => {
    setProcessedImage(null);
    setTranslatedText("");
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className="container"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div>
        <h1 className="text-center p-2">Image Translator</h1>
      </div>
      <div>
        Welcome to Image Translator! <br />
        Upload, paste or drag & drop your image, choose languages and translate.
        Easy as that!
      </div>
      <div className="mt-3 mb-3">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="fromLanguage">From: </label>
          <select
            id="fromLanguage"
            className="form-control"
            value={fromLanguage}
            onChange={handleFromLanguageChange}
          >
            <option value="">Select a language</option>
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="toLanguage">To: </label>
          <select
            id="toLanguage"
            className="form-control"
            value={toLanguage}
            onChange={handleToLanguageChange}
          >
            <option value="">Select a language</option>
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-3 text-center">
        <button className="btn btn-success" onClick={processImage}>
          Translate
        </button>
      </div>
      <div className="row mt-3">
        {fileUrl && (
          <div className="col-md-6">
            <h2 className="text-center">Your Image</h2>
            <img
              src={fileUrl}
              alt="Selected"
              className="img-fluid mx-auto d-block"
            />
          </div>
        )}
        {processedImage && (
          <div className="col-md-6">
            <h2 className="text-center">Processed Image</h2>
            <img
              src={`data:image/jpeg;base64,${processedImage}`}
              alt="Processed"
              className="img-fluid mx-auto d-block"
            />
          </div>
        )}
      </div>
      {detectedText && translatedText && (
        <div className="row mt-3">
          <div className="col-md-6">
            <h2 className="text-center">Detected Text</h2>
            <textarea className="form-control" value={detectedText} readOnly />
          </div>
          <div className="col-md-6">
            <h2 className="text-center">Translated Text</h2>
            <textarea
              className="form-control"
              value={translatedText}
              readOnly
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageTranslator;
