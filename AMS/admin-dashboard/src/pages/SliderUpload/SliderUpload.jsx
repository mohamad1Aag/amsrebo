import React, { useState } from 'react';
import axios from 'axios';

export default function SliderUpload() {
  const [image, setImage] = useState(null);
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('description_ar', descriptionAr);
    formData.append('description_en', descriptionEn);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/slider/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // إذا عندك توكن
          },
        }
      );
      alert('تم رفع الصورة بنجاح');
    } catch (err) {
      alert('فشل رفع الصورة');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">رفع صورة سلايدر</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <input
          type="text"
          placeholder="الوصف بالعربية"
          value={descriptionAr}
          onChange={(e) => setDescriptionAr(e.target.value)}
          className="block w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Description in English"
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
          className="block w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          رفع
        </button>
      </form>
    </div>
  );
}
