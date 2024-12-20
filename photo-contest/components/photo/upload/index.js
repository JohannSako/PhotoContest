import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";
import Image from 'next/image';

export default function Upload({ width = 'w-[288px]', height = 'h-[494px]', border = 'rounded-none', borderColor = 'border-black', onImageChange, defaultImage = '' }) {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setSelectedImage(defaultImage);
  }, [defaultImage])

  const uploadImage = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (file) => {
    setIsUploading(true);

    // Préparer les données pour Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'photoContest');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/diwvp0p86/image/upload',
        formData
      );

      const imageUrl = response.data.secure_url;
      setSelectedImage(imageUrl);
      onImageChange(imageUrl);
    } catch (error) {
      console.error('Erreur lors de l’upload :', error);
      toast.error('Une erreur est survenue lors de l’upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageChange}
        accept="image/*"
      />
      <div
        className={`flex ${width} ${height} bg-[#ECE2E2] ${borderColor} border-solid border-4 ${border} active:opacity-50 items-center justify-center cursor-pointer`}
        onClick={uploadImage}
      >
        {isUploading ? (
          <p>Uploading...</p>
        ) : selectedImage ? (
          <img src={selectedImage} alt="Selected" className={`w-full h-full object-cover ${border}`} />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="76" height="72" viewBox="0 0 76 72" fill="none">
            <path
              d="M51.7936 21.3125L47.9097 15.5563C47.0912 14.6612 45.9692 14.1028 44.7115 14.1028H31.2885C30.0308 14.1028 28.9089 14.6612 28.0903 15.5563L24.2064 21.3125C23.3879 22.2089 22.333 22.8617 21.0754 22.8617H12.3212C11.083 22.8617 9.89541 23.3231 9.01983 24.1444C8.14424 24.9657 7.65234 26.0796 7.65234 27.2411V53.5177C7.65234 54.6792 8.14424 55.7932 9.01983 56.6145C9.89541 57.4358 11.083 57.8972 12.3212 57.8972H63.6788C64.9171 57.8972 66.1046 57.4358 66.9802 56.6145C67.8558 55.7932 68.3477 54.6792 68.3477 53.5177V27.2411C68.3477 26.0796 67.8558 24.9657 66.9802 24.1444C66.1046 23.3231 64.9171 22.8617 63.6788 22.8617H55.0706C53.8085 22.8617 52.6121 22.2089 51.7936 21.3125Z"
              stroke="#5DB075"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M38 49.1383C44.4464 49.1383 49.6722 44.2365 49.6722 38.1897C49.6722 32.143 44.4464 27.2411 38 27.2411C31.5536 27.2411 26.3278 32.143 26.3278 38.1897C26.3278 44.2365 31.5536 49.1383 38 49.1383Z"
              stroke="#5DB075"
              strokeWidth="5"
              strokeMiterlimit="10"
            />
            <path
              d="M18.7409 22.588V19.5771H15.2393V22.588"
              stroke="#5DB075"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
