import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../src/ThemeContext';  // عدل المسار حسب مشروعك

function Services() {
  const { i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [sections, setSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await axios.get('https://my-backend-dgp2.onrender.com/api/sections');
      setSections(res.data);
    } catch (error) {
      console.error('حدث خطأ أثناء جلب الأقسام:', error);
    }
  };

  // دالة تعرض النص المناسب حسب اللغة، تتعامل حتى لو كان المكون JSX وليس نص فقط
  const getLocalizedText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field; // إذا كان نص عادي
    // إذا كان كائن لغة متعدد:
    if (typeof field === 'object') {
      // في حال كان React Element أو مكون JSX مخزن
      if (React.isValidElement(field)) {
        return field;
      }
      // أو كائن لغات:
      return field[i18n.language] || field.en || '';
    }
    return '';
  };

  // فلترة حسب الاسم حسب اللغة الحالية، مع التأكد من تحويل الاسم لنص عادي
  const filteredSections = sections.filter(section => {
    const localizedName = getLocalizedText(section.name);
  
    // تأكد إن localizedName نص (string) وليس React Element أو غيره
    const nameText = typeof localizedName === 'string' ? localizedName : '';
  
    return nameText.toLowerCase().includes(searchTerm.toLowerCase());
  });
  

  return (
    <>
      <div className={`min-h-screen ${darkMode 
          ? 'bg-gray-900 text-white' 
          : 'bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-200 text-black'}`}>
        <Header />

        {/* حقل البحث */}
        <div className="max-w-md mx-auto my-8 px-4">
          <input
            type="text"
            placeholder="ابحث باسم القسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-5 py-3 rounded-xl border shadow-md
              focus:outline-none focus:ring-4 focus:ring-purple-400
              transition placeholder-purple-400 font-semibold
              ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-purple-900'}`}
          />
        </div>

        {/* شبكة الكروت */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {filteredSections.length === 0 ? (
            <p className={`col-span-full text-center
              ${darkMode ? 'text-gray-400' : 'text-gray-700'} text-base sm:text-lg font-medium`}>
              لا توجد نتائج مطابقة.
            </p>
          ) : (
            filteredSections.map((section) => (
              <Link
                key={section._id}
                to={`/section/${section._id}`}
                className={`group block rounded-2xl shadow-md overflow-hidden
                  transform hover:scale-105 hover:shadow-xl transition-transform duration-300
                  ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                title={getLocalizedText(section.name).toString()}
              >
                <div className="h-36 sm:h-44 md:h-52 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                  <img
                    src={section.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={getLocalizedText(section.name).toString() || 'صورة قسم'}
                    className="w-full h-full object-cover object-center
                      group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 sm:p-5 text-center">
                  <h3 className={`text-lg sm:text-xl font-extrabold truncate
                    ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                    {getLocalizedText(section.name)}
                  </h3>
                  {section.description && (
                    <p className={`mt-1 text-xs sm:text-sm line-clamp-2
                      ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {getLocalizedText(section.description)}
                    </p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Services;
