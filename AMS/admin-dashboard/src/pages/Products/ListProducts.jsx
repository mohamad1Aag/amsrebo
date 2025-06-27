import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../../../src/ThemeContext'; // عدل حسب مكان ملفك

const ListProducts = () => {
  const { t, i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // جلب المنتجات والتقييمات
  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://my-backend-dgp2.onrender.com/api/products');
      setProducts(res.data);

      const ratingData = {};
      await Promise.all(
        res.data.map(async (product) => {
          try {
            const ratingRes = await axios.get(
              `https://my-backend-dgp2.onrender.com/api/ratings/${product._id}/average`
            );
            ratingData[product._id] = ratingRes.data.average || 0;
          } catch {
            ratingData[product._id] = 0;
          }
        })
      );
      setRatings(ratingData);
    } catch (err) {
      console.error(t('error_fetching_products'), err);
    }
  };

  // عرض النجوم حسب المتوسط
  const renderStars = (average) => {
    const rounded = Math.round(average);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rounded ? 'text-yellow-400' : 'text-gray-400'}>
          ★
        </span>
      );
    }
    return <div className="mt-1 text-lg">{stars}</div>;
  };

  // فلترة المنتجات بناء على الاسم (اللغة الحالية)
  const filteredProducts = products.filter(product => {
    const name = product.name?.[i18n.language] || product.name?.en || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleEdit = (product) => {
    setEditingProduct({
      ...product,
      name: product.name || { ar: '', en: '' },
      description: product.description || { ar: '', en: '' }
    });
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

      // نرسل الاسم والوصف كـ JSON strings
      formData.append('name', JSON.stringify(editingProduct.name));
      formData.append('description', JSON.stringify(editingProduct.description));
      formData.append('price', editingProduct.price);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await axios.put(
        `https://my-backend-dgp2.onrender.com/api/products/${editingProduct._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setProducts(products.map(prod =>
        prod._id === response.data._id ? response.data : prod
      ));
      setEditingProduct(null);
      setSelectedFile(null);
    } catch (error) {
      alert(t('error_updating_product') || 'فشل تعديل المنتج');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirm_delete') || "هل أنت متأكد من الحذف؟")) return;

    try {
      await axios.delete(`https://my-backend-dgp2.onrender.com/api/products/delete/${id}`);
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      alert(t('error_deleting_product') || "حدث خطأ أثناء الحذف");
      console.error(error);
    }
  };

  // دالة لعرض الاسم/الوصف حسب اللغة الحالية
  const getLocalizedText = (obj) => {
    if (!obj) return '';
    return obj[i18n.language] || obj.en || '';
  };

  return (
    <div className={`p-6 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 text-black'}`}>
      <h2 className="text-2xl font-bold text-center mb-6 text-purple-900">{t('all_products')}</h2>

      <input
        type="text"
        placeholder={t('search_by_name')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full max-w-md mx-auto mb-6 px-4 py-2 rounded border shadow block focus:outline-none focus:ring-2 focus:ring-purple-600 ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
      />

      {filteredProducts.length === 0 ? (
        <p className="text-center text-purple-900">{t('no_results')}</p>
      ) : (
        <div className={`overflow-x-auto max-w-5xl mx-auto rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <table className="min-w-full text-sm text-center rounded">
            <thead className={`rounded-t-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-purple-800 text-white'}`}>
              <tr>
                <th className="p-3">{t('name')}</th>
                <th className="p-3">{t('description')}</th>
                <th className="p-3">{t('price')}</th>
                <th className="p-3">{t('image')}</th>
                <th className="p-3">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id} className="border-b last:border-b-0">
                  <td className="p-3 font-semibold">
                    {getLocalizedText(product.name)}
                    {ratings[product._id] !== undefined && renderStars(ratings[product._id])}
                  </td>
                  <td className="p-3">{getLocalizedText(product.description)}</td>
                  <td className="p-3">{product.price} {t('sar')}</td>
                  <td className="p-3">
                    <img
                      src={product.image}
                      alt={getLocalizedText(product.name)}
                      className="w-24 h-16 object-cover mx-auto rounded"
                    />
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 px-3 py-1 rounded font-semibold transition"
                    >
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold transition"
                    >
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingProduct && (
        <div className={`mt-10 p-6 rounded-xl shadow-lg max-w-xl mx-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h3 className="text-lg font-bold mb-4 text-center text-purple-800">{t('edit_product')}</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={editingProduct.name[i18n.language] || editingProduct.name.en || ''}
              onChange={(e) => setEditingProduct({
                ...editingProduct,
                name: {
                  ...editingProduct.name,
                  [i18n.language]: e.target.value
                }
              })}
              placeholder={t('name')}
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
            />
            <input
              type="text"
              value={editingProduct.description[i18n.language] || editingProduct.description.en || ''}
              onChange={(e) => setEditingProduct({
                ...editingProduct,
                description: {
                  ...editingProduct.description,
                  [i18n.language]: e.target.value
                }
              })}
              placeholder={t('description')}
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
            />
            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
              placeholder={t('price')}
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
            />
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className={`w-full ${darkMode ? 'text-white' : 'text-black'}`}
            />
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={handleUpdate}
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded font-semibold transition"
              >
                {t('save')}
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded font-semibold transition"
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

export default ListProducts;
