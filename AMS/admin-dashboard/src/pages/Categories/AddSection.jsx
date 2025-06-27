import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../../../src/ThemeContext';

const AddSection = () => {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name_ar', nameAr);
      formData.append('name_en', nameEn);
      formData.append('description_ar', descriptionAr);
      formData.append('description_en', descriptionEn);
      formData.append('image', image);

      const res = await axios.post(
        'https://my-backend-dgp2.onrender.com/api/sections/add',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(`✅ ${t('section_added')}: ${res.data.name.ar} / ${res.data.name.en}`);
      setNameAr('');
      setNameEn('');
      setDescriptionAr('');
      setDescriptionEn('');
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setMessage(`❌ ${t('error')}: ${err.response?.data?.error || t('something_went_wrong')}`);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 text-black'}`}>
      <div className="p-6 flex flex-col items-center">
        <div className={`rounded-xl shadow-lg p-6 w-full max-w-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">{t('add_new_section')}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
  <input
    type="text"
    placeholder={t('section_name_ar')}
    value={nameAr}
    onChange={(e) => setNameAr(e.target.value)}
    required
    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 ${
      darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-black bg-white border-gray-300'
    }`}
  />

  <input
    type="text"
    placeholder={t('section_name_en')}
    value={nameEn}
    onChange={(e) => setNameEn(e.target.value)}
    required
    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 ${
      darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-black bg-white border-gray-300'
    }`}
  />

  <textarea
    placeholder={t('section_desc_ar')}
    value={descriptionAr}
    onChange={(e) => setDescriptionAr(e.target.value)}
    className={`w-full p-3 border rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-600 ${
      darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-black bg-white border-gray-300'
    }`}
  />

  <textarea
    placeholder={t('section_desc_en')}
    value={descriptionEn}
    onChange={(e) => setDescriptionEn(e.target.value)}
    className={`w-full p-3 border rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:ring-purple-600 ${
      darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-black bg-white border-gray-300'
    }`}
  />

  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={(e) => setImage(e.target.files[0])}
    required
    className={`w-full ${
      darkMode ? 'text-white' : 'text-black'
    }`}
  />

  <button
    type="submit"
    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-md transition"
  >
    ➕ {t('add')}
  </button>
</form>


          {message && (
            <p
              className={`mt-4 text-center font-bold ${
                message.includes('✅') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSection;
