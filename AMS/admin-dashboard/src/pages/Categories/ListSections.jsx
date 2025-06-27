import React, { useEffect, useState, useContext } from 'react'; 
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../../../src/ThemeContext';

const ListSections = () => {
  const [sections, setSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { t, i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    axios.get('https://my-backend-dgp2.onrender.com/api/sections')
      .then(res => setSections(res.data))
      .catch(err => console.error('خطأ بجلب الأقسام:', err));
  }, []);

  const filteredSections = sections.filter(section =>
    section.name?.[i18n.language]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (section) => {
    setEditingSection(section);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name_ar', editingSection.name.ar);
      formData.append('name_en', editingSection.name.en);
      formData.append('description_ar', editingSection.description.ar);
      formData.append('description_en', editingSection.description.en);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await axios.put(
        `https://my-backend-dgp2.onrender.com/api/sections/edit/${editingSection._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSections(sections.map(sec =>
        sec._id === response.data._id ? response.data : sec
      ));

      setEditingSection(null);
      setSelectedFile(null);
    } catch (error) {
      alert('فشل تعديل القسم، حاول مرة أخرى');
      console.error(error);
    }
  };

  const inputClass = `w-full border rounded px-4 py-2 
    ${darkMode 
      ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-300' 
      : 'bg-white text-black border-gray-300 placeholder-gray-500'}`;

  const fileInputClass = `${darkMode ? 'text-white' : 'text-black'} w-full`;

  return (
    <div className={`p-6 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 text-black'}`}>
      <h2 className="text-2xl font-bold text-center mb-6">{t('all_sections')}</h2>

      <input
        type="text"
        placeholder={t('search_placeholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full max-w-md mx-auto mb-6 px-4 py-2 rounded border shadow focus:outline-none focus:ring-2 focus:ring-purple-500 block
          ${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-300' : 'bg-white text-black border-gray-300 placeholder-gray-500'}
        `}
      />

      {filteredSections.length === 0 ? (
        <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('no_results')}</p>
      ) : (
        <div className={`overflow-x-auto max-w-5xl mx-auto rounded-xl shadow-lg
          ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <table className="min-w-full text-center text-sm md:text-base">
            <thead className="bg-purple-800 text-white">
              <tr>
                <th className="p-3">{t('section_name_ar')}</th>
                <th className="p-3">{t('section_desc_ar')}</th>
                <th className="p-3">{t('image')}</th>
                <th className="p-3">{t('edit')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSections.map(section => (
                <tr key={section._id} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                  <td className="p-3 font-semibold">{section.name?.[i18n.language]}</td>
                  <td className="p-3">{section.description?.[i18n.language]}</td>
                  <td className="p-3">
                    <img
                      src={section.image}
                      alt={t('image')}
                      className="w-40 h-24 object-cover rounded-md mx-auto"
                    />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(section)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
                    >
                      {t('edit')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingSection && (
        <div className={`max-w-xl mx-auto mt-10 p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h3 className="text-lg font-bold mb-4 text-center text-purple-800">{t('edit')}</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={editingSection.name?.ar}
              onChange={(e) => setEditingSection({ ...editingSection, name: { ...editingSection.name, ar: e.target.value } })}
              placeholder={t('section_name_ar')}
              className={inputClass}
            />
            <input
              type="text"
              value={editingSection.name?.en}
              onChange={(e) => setEditingSection({ ...editingSection, name: { ...editingSection.name, en: e.target.value } })}
              placeholder={t('section_name_en')}
              className={inputClass}
            />
            <textarea
              value={editingSection.description?.ar}
              onChange={(e) => setEditingSection({ ...editingSection, description: { ...editingSection.description, ar: e.target.value } })}
              placeholder={t('section_desc_ar')}
              className={inputClass}
              rows={2}
            />
            <textarea
              value={editingSection.description?.en}
              onChange={(e) => setEditingSection({ ...editingSection, description: { ...editingSection.description, en: e.target.value } })}
              placeholder={t('section_desc_en')}
              className={inputClass}
              rows={2}
            />
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className={fileInputClass}
            />
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded"
              >
                {t('save_changes')}
              </button>
              <button
                onClick={() => setEditingSection(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListSections;
