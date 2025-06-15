import { useEffect, useState } from "react";
const UseImageUpload = (initialImage = null) => {
  const [imageUrl, setImageUrl] = useState(
    initialImage ? URL.createObjectURL(initialImage) : null,
  );
  const [imageFile, setImageFile] = useState(initialImage);

  const convertToBase64 = () => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  useEffect(() => {
    convertToBase64();
  }, [imageFile, convertToBase64]);

  const setFile = (file) => {
    setImageFile(file);
  };

  return {
    imageUrl,
    setFile,
    imageFile,
    setImageUrl,
  };
};

export default UseImageUpload;
