import React, { useState, useEffect } from "react";
import "./SubirImagen.css";

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem("uploadedImages")) || [];
    setUploadedImages(savedImages);
  }, []);

  const saveImagesToLocalStorage = (images) => {
    localStorage.setItem("uploadedImages", JSON.stringify(images));
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert("✅ URL copiada al portapapeles");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validFormats = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!validFormats.includes(file.type)) {
      alert("⚠️ Formato no permitido. Solo JPG, PNG, WEBP y AVIF.");
      return;
    }

    setImage(file);
  };

  const uploadImage = async () => {
    if (!image) return alert("⚠️ Selecciona una imagen primero.");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "sabor_y_huellitas_preset");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dozphinph/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setImageUrl(data.secure_url);
      const updatedImages = [...uploadedImages, data];

      setUploadedImages(updatedImages);
      saveImagesToLocalStorage(updatedImages);
      setUploadMessage("✅ Imagen subida con éxito!");
    } catch (error) {
      console.error("❌ Error al subir imagen:", error);
      setUploadMessage("❌ Error al subir la imagen.");
    }
  };

  return (
    <div className="upload-container">
      <h2>📤 Subir Imagen a Cloudinary</h2>

      <div className="upload-box">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button onClick={uploadImage} className="upload-btn">Subir Imagen</button>
      </div>

      {uploadMessage && <p className="success-message">{uploadMessage}</p>}

      {/* Tabla para mostrar imágenes subidas */}
      {uploadedImages.length > 0 && (
        <div className="image-table-container">
          <h3>📸 Imágenes Subidas</h3>
          <table className="image-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>URL</th>
                <th>Copiar</th>
              </tr>
            </thead>
            <tbody>
              {uploadedImages.map((img, index) => (
                <tr key={index}>
                  <td>
                    <img src={img.secure_url} alt={img.original_filename} />
                  </td>
                  <td>
                    <a href={img.secure_url} target="_blank" rel="noopener noreferrer" className="image-url">
                      {img.secure_url}
                    </a>
                  </td>
                  <td>
                    <button onClick={() => copyToClipboard(img.secure_url)} className="copy-btn">
                      📋 Copiar URL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadImage;