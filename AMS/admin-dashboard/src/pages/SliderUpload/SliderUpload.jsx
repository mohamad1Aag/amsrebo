import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from '../../../../src/components/Header';
import Sidebar from '../../layouts/Sidebar'; // ✅ استيراد السايدبار
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../../../src/ThemeContext';

export default function SliderUpload() {
  const { t, i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [image, setImage] = useState(null);
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [loading, setLoading] = useState(false);
  const [sliders, setSliders] = useState([]);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // لإدارة حالة السايدبار

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await axios.get('https://my-backend-dgp2.onrender.com/api/slider');
      setSliders(res.data);
    } catch (err) {
      setError('فشل جلب الصور');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!token) return alert('لم يتم تسجيل الدخول');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('description_ar', descriptionAr);
    formData.append('description_en', descriptionEn);

    try {
      setLoading(true);
      await axios.post(
        'https://my-backend-dgp2.onrender.com/api/slider/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('تم رفع الصورة بنجاح');
      setImage(null);
      setDescriptionAr('');
      setDescriptionEn('');
      fetchSliders();
    } catch (err) {
      alert('فشل رفع الصورة');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return alert('لم يتم تسجيل الدخول');
    if (!window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

    try {
      await axios.delete(
        `https://my-backend-dgp2.onrender.com/api/slider/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('تم الحذف بنجاح');
      fetchSliders();
    } catch (err) {
      alert('فشل الحذف');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? 'bg-gray-900 text-white'
          : 'bg-gradient-to-b from-purple-100 to-yellow-50 text-gray-900'
      } ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}
    >
      <Header />
      <div className="flex flex-1">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {t('upload_slider_image') || 'رفع صورة سلايدر'}
          </h2>

          <form
            onSubmit={handleUpload}
            className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-gray-900 dark:text-white"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
              className="block w-full text-sm text-gray-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="الوصف بالعربية"
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              className="block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Description in English"
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              className="block w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'جارٍ الرفع...' : 'رفع'}
            </button>
          </form>

          <h3 className="text-xl font-semibold mt-10 mb-4">
            {t('current_sliders') || 'الصور الحالية'}
          </h3>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 gap-4">
            {sliders.length === 0 && <p>{t('no_images') || 'لا توجد صور حالياً'}</p>}
            {sliders.map((slider) => (
              <div
                key={slider._id}
                className="border p-3 rounded flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <img
                  src={slider.image}
                  alt={slider.description?.ar || ''}
                  className="w-full md:w-40 h-24 object-cover rounded"
                />
                <div className="flex-1 text-sm">
                  <p>
                    <strong>{t('arabic_description') || 'الوصف بالعربية'}:</strong>{' '}
                    {slider.description.ar}
                  </p>
                  <p>
                    <strong>{t('english_description') || 'Description (EN)'}:</strong>{' '}
                    {slider.description.en}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(slider._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  {t('delete') || 'حذف'}
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
