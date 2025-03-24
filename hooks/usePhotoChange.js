import { useState } from "react";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export const usePhotoChange = (initialImageUrl = null) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl || null);
  const [file, setFile] = useState(null);

  const handlePhotoChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done" || info.file.status === "error") {
      setFile(info.file.originFileObj);
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const resetImage = () => {
    setImageUrl(initialImageUrl || null);
    setFile(null);
    setLoading(false);
  };

  const clearImage = () => {
    setImageUrl(null);
    setFile(null);
    setLoading(false);
  };

  return {
    loading,
    imageUrl,
    file,
    handlePhotoChange,
    resetImage,
    clearImage,
  };
};
