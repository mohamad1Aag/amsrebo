import React, { useState, useEffect, useRef, useContext } from 'react'; 
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../../../src/ThemeContext';

const AddProduct = () => {
  const { t, i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [sectionId, setSectionId] = useState('');

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');

  // السعر المفرق والجملة
  const [priceRetail, setPriceRetail] = useState('');
  const [priceWholesale, setPriceWholesale] = useState('');

  // نوع السعر للعرض
  const [priceType, setPriceType] = useState('retail'); // retail أو wholesale

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    axios.get('https://my-backend-dgp2.onrender.com/api/sections')
      .then(res => setSections(res.data))
      .catch(err => console.error(t('error_fetching_sections'), err));
  }, [t]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://my-backend-dgp2.onrender.com/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(t('error_fetching_products'), err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm(t('confirm_delete'))) return;
    try {
      await axios.delete(`https://my-backend-dgp2.onrender.com/api/products/${productId}`);
      setMessage(t('product_deleted_success'));
      fetchProducts();
    } catch (err) {
      setMessage(t('product_delete_failed'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sectionId) {
      setMessage(t('please_select_section'));
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage(t('admin_login_required'));
      return;
    }

    let adminId = null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      adminId = payload.id;
    } catch (error) {
      setMessage(t('invalid_token'));
      return;
    }

    const nameObj = { ar: nameAr, en: nameEn };
    const descriptionObj = { ar: descAr, en: descEn };

    const formData = new FormData();
    formData.append('section', sectionId);
    formData.append('name', JSON.stringify(nameObj));
    formData.append('description', JSON.stringify(descriptionObj));
    formData.append('priceRetail', priceRetail);
    formData.append('priceWholesale', priceWholesale);
    formData.append('image', image);
    formData.append('adminId', adminId);

    try {
      const res = await axios.post(
        'https://my-backend-dgp2.onrender.com/api/products',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setMessage(`${t('product_added_success')}: ${res.data.name[i18n.language] || res.data.name.en}`);
      setNameAr('');
      setNameEn('');
      setDescAr('');
      setDescEn('');
      setPriceRetail('');
      setPriceWholesale('');
      setSectionId('');
      setImage(null);
      if (fileRef.current) fileRef.current.value = '';
      fetchProducts();
    } catch (err) {
      setMessage(`${t('error_occurred')}: ${err.response?.data?.error || t('something_wrong')}`);
    }
  };

  const getSectionName = (section) => {
    if (!section || !section.name) return '';
    return section.name[i18n.language] || section.name.en || '';
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 text-black'} p-6 min-h-screen`}>
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-xl mx-auto rounded-xl shadow-lg p-6 mb-10`}>
        <h2 className="text-2xl font-bold text-center text-purple-800 mb-4">{t('add_new_product')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            required
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'} w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500`}
          >
            <option value="">{t('select_section')}</option>
            {sections.map(section => (
              <option key={section._id} value={section._id}>{getSectionName(section)}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder={t('product_name_ar')}
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            required
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'} w-full p-2 border rounded focus:outline-none`}
          />

          <input
            type="text"
            placeholder={t('product_name_en')}
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            required
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'} w-full p-2 border rounded focus:outline-none`}
          />

          <textarea
            placeholder={t('product_description_ar')}
            value={descAr}
            onChange={(e) => setDescAr(e.target.value)}
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'} w-full p-2 border rounded focus:outline-none`}
            rows={3}
          />

          <textarea
            placeholder={t('product_description_en')}
            value={descEn}
            onChange={(e) => setDescEn(e.target.value)}
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'} w-full p-2 border rounded focus:outline-none`}
            rows={3}
          />

          {/* أسعار المفرق والجملة */}
          <input
            type="number"
            placeholder={t('price_retail')}
            value={priceRetail}
            onChange={(e) => setPriceRetail(e.target.value)}
            required
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'} w-full p-2 border rounded focus:outline-none`}
          />

          <input
            type="number"
            placeholder={t('price_wholesale')}
            value={priceWholesale}
            onChange={(e) => setPriceWholesale(e.target.value)}
            required
            className={`${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'} w-full p-2 border rounded focus:outline-none`}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={(e) => setImage(e.target.files[0])}
            required
            className={`w-full ${darkMode ? 'text-white' : 'text-black'}`}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
          >
            ➕ {t('add_product')}
          </button>
        </form>

        {message && (
          <p className={`text-center mt-4 font-bold ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>

      {/* اختيار نوع السعر للعرض */}
      <div className="max-w-5xl mx-auto mb-4 flex justify-center space-x-4">
        <button
          onClick={() => setPriceType('retail')}
          className={`px-4 py-2 rounded ${
            priceType === 'retail' ? 'bg-purple-700 text-white' : 'bg-gray-300 text-black'
          }`}
        >
          {t('retail_price')}
        </button>
        <button
          onClick={() => setPriceType('wholesale')}
          className={`px-4 py-2 rounded ${
            priceType === 'wholesale' ? 'bg-purple-700 text-white' : 'bg-gray-300 text-black'
          }`}
        >
          {t('wholesale_price')}
        </button>
      </div>

      {/* جدول المنتجات */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg max-w-5xl mx-auto`}>
        <h2 className="text-xl font-bold text-center text-purple-700 mb-4">{t('added_products')}</h2>
        {products.length === 0 ? (
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} text-center`}>{t('no_products_yet')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center border">
              <thead className="bg-purple-800 text-white">
                <tr>
                  <th className="p-2 border">{t('name')}</th>
                  <th className="p-2 border">{t('description')}</th>
                  <th className="p-2 border">{t('price')}</th>
                  <th className="p-2 border">{t('image')}</th>
                  <th className="p-2 border">{t('action')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-t">
                    <td className="p-2 border">{product.name?.[i18n.language] || product.name?.en || ''}</td>
                    <td className="p-2 border">{product.description?.[i18n.language] || product.description?.en || ''}</td>
                    <td className="p-2 border">
                      {priceType === 'retail' ? product.priceRetail : product.priceWholesale} ر.س
                    </td>
                    <td className="p-2 border">
                      <img
                        src={product.image}
                        alt={t('product_image')}
                        className="w-24 h-16 object-cover mx-auto rounded"
                      />
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                      >
                        🗑️ {t('delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
