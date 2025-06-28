import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../src/ThemeContext';
import Header from './Header';

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    console.error('Failed to parse JWT', e);
    return null;
  }
}

function SectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [section, setSection] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [saleType, setSaleType] = useState('مفرق'); // نوع البيع (مفرق أو جملة)

  // مودالات التحكم
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // فلترة وترتيب
  const [searchTerm, setSearchTerm] = useState('');
  const [priceOrder, setPriceOrder] = useState('');
  const [ratingOrder, setRatingOrder] = useState('');

  // تقييمات
  const [ratingsByProduct, setRatingsByProduct] = useState({});
  const [averageRatings, setAverageRatings] = useState({});

  // بيانات التقييم الجديد
  const [newRatingValue, setNewRatingValue] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');

  useEffect(() => {
    fetchSection();
    fetchProducts();
  }, [id]);

  const fetchSection = async () => {
    try {
      const res = await axios.get(`https://my-backend-dgp2.onrender.com/api/sections`);
      const matchedSection = res.data.find((sec) => sec._id === id);
      setSection(matchedSection);
    } catch (error) {
      console.error('خطأ أثناء جلب بيانات القسم:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`https://my-backend-dgp2.onrender.com/api/by-section/${id}`);
      setProducts(res.data);
      res.data.forEach(async (product) => {
        await fetchRatings(product._id);
        await fetchAverageRating(product._id);
      });
    } catch (error) {
      console.error('خطأ أثناء جلب المنتجات:', error);
    }
  };

  const fetchRatings = async (productId) => {
    try {
      const res = await axios.get(`https://my-backend-dgp2.onrender.com/api/ratings/${productId}`);
      setRatingsByProduct(prev => ({ ...prev, [productId]: res.data }));
    } catch (error) {
      console.error('خطأ أثناء جلب التقييمات:', error);
    }
  };

  const fetchAverageRating = async (productId) => {
    try {
      const res = await axios.get(`https://my-backend-dgp2.onrender.com/api/ratings/${productId}/average`);
      setAverageRatings(prev => ({ ...prev, [productId]: res.data }));
    } catch (error) {
      console.error('خطأ أثناء جلب متوسط التقييم:', error);
    }
  };

  const getLocalizedText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') {
      return field[i18n.language] || field.en || '';
    }
    return '';
  };

  // فتح مودال التقييم
  const openRatingModal = (product) => {
    setSelectedProduct(product);
    setNewRatingValue(0);
    setNewReviewText('');
    setShowRatingModal(true);
  };

  // إرسال التقييم
  const submitRating = async () => {
    if (!selectedProduct || newRatingValue === 0) {
      setToastMessage(t('please_select_rating'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const token = localStorage.getItem('userToken');
    let userId = null;
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.id) userId = decoded.id;
    }

    try {
      await axios.post(`https://my-backend-dgp2.onrender.com/api/ratings`, {
        productId: selectedProduct._id,
        rating: newRatingValue,
        review: newReviewText,
        userId,
      });

      setToastMessage(t('rating_saved_successfully'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      setShowRatingModal(false);
      fetchRatings(selectedProduct._id);
      fetchAverageRating(selectedProduct._id);
    } catch (error) {
      console.error('خطأ أثناء حفظ التقييم:', error);
      setToastMessage(t('error_saving_rating'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // عرض نجوم التقييم (ثابتة)
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-600'}>
          ★
        </span>
      );
    }
    return stars;
  };

  // عرض نجوم التقييم التفاعلية (اختيارية)
  const renderInteractiveStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`cursor-pointer text-3xl ${i <= newRatingValue ? 'text-yellow-400' : 'text-gray-600'}`}
          onClick={() => setNewRatingValue(i)}
          role="button"
          aria-label={`${t('rate')} ${i} ${t('stars')}`}
          title={`${i} ${t('stars')}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // فتح مودال إضافة للسلة
  const openAddToCartModal = (product) => {
    setSelectedProduct(product);
    if (saleType === "جملة") {
      setQuantity(12); // الكمية الافتراضية لجملة
    } else {
      setQuantity(1);
    }
    setShowAddToCartModal(true);
  };

  // تأكيد إضافة للسلة
  const confirmAddToCart = () => {
    if (quantity < 1) {
      setToastMessage(t('please_select_valid_quantity'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // حسب نوع البيع نستخدم السعر المناسب
    const priceToUse = saleType === 'مفرق' ? selectedProduct.priceRetail : selectedProduct.priceWholesale;

    const newItem = {
      productId: selectedProduct._id,
      name: getLocalizedText(selectedProduct.name),
      price: priceToUse,
      image: selectedProduct.image || 'https://dummyimage.com/150x150/000/fff.png&text=No+Image',
      quantity,
      type: saleType,
      adminId: selectedProduct.adminId || selectedProduct.vendorId || selectedProduct.ownerId || null,
    };

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.productId === selectedProduct._id && item.type === saleType
      );

      let updatedCart;
      if (existingIndex >= 0) {
        updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += quantity;
      } else {
        updatedCart = [...prevCart, newItem];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });

    setShowAddToCartModal(false);
    setShowCartModal(true);
    setToastMessage(t('added_to_cart'));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // إغلاق مودال السلة
  const closeCartModal = () => {
    setShowCartModal(false);
    setQuantity(1);
  };

  const filteredProducts = [...products]
    .filter(product => getLocalizedText(product.name).toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // نرتب حسب السعر حسب نوع البيع المختار
      const priceA = saleType === 'مفرق' ? a.priceRetail : a.priceWholesale;
      const priceB = saleType === 'مفرق' ? b.priceRetail : b.priceWholesale;

      if (priceOrder === 'asc') return priceA - priceB;
      if (priceOrder === 'desc') return priceB - priceA;
      return 0;
    })
    .sort((a, b) => {
      if (ratingOrder === 'high') return (averageRatings[b._id]?.average || 0) - (averageRatings[a._id]?.average || 0);
      if (ratingOrder === 'low') return (averageRatings[a._id]?.average || 0) - (averageRatings[b._id]?.average || 0);
      return 0;
    });

  if (!section) {
    return (
      <p className={`text-center mt-10 font-semibold ${darkMode ? 'text-white' : 'text-yellow-600'}`}>
        {t('loading_section_details')}
      </p>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-200 text-black'}`}>
      <Header />

      <div className="fixed top-6 right-6 z-50">
        <button
          className={`relative px-5 py-3 rounded-full shadow-lg flex items-center gap-3 text-lg font-bold ${darkMode ? 'bg-yellow-400 text-purple-900 hover:bg-yellow-300' : 'bg-yellow-400 text-purple-900 hover:bg-yellow-300'}`}
          onClick={() => navigate('/cart')}
          aria-label="Cart"
        >
          🛒 {t('cart')}
          {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
            <span className="absolute -top-2 -right-2 bg-purple-900 text-yellow-400 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <main className="p-6 max-w-7xl mx-auto relative flex-grow">
        <section className={`flex flex-col md:flex-row items-center md:items-start gap-10 rounded-xl p-8 shadow-xl max-w-5xl mx-auto ${darkMode ? 'bg-gray-900 bg-opacity-90' : 'bg-purple-100 bg-opacity-40'}`}>
          <img
            src={section.image || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={getLocalizedText(section.name)}
            className="w-full md:w-1/2 h-64 md:h-80 object-cover rounded-lg shadow-lg"
          />
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className={`text-4xl font-extrabold mb-4 ${darkMode ? 'text-white' : 'text-purple-900'}`}>
              {getLocalizedText(section.name)}
            </h2>
            <p className={`${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {getLocalizedText(section.description)}
            </p>
          </div>
        </section>

        {/* اختيار نوع البيع */}
        <div className="flex justify-center gap-4 mt-10 mb-8 text-lg">
  {['مفرق', 'جملة'].map((type) => (
    <button
      key={type}
      onClick={() => setSaleType(type)}
      className={`px-6 py-2 rounded-full border-2 transition font-bold shadow-md ${
        saleType === type
          ? 'bg-yellow-400 text-purple-900 border-yellow-500'
          : darkMode
          ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
          : 'bg-white text-purple-900 border-purple-400 hover:bg-purple-100'
      }`}
    >
      {type}
    </button>
  ))}
</div>


        {/* الفلاتر */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {/* مربع البحث */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}>
              <span className="text-xl">🔍</span>
              <input
                type="text"
                placeholder={t('search_products')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-transparent outline-none placeholder-gray-400 font-medium ${
                  darkMode ? 'text-white' : 'text-black'
                }`}
              />
            </div>

            {/* ترتيب حسب السعر */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}>
              <span className="text-xl">💰</span>
              <select
                value={priceOrder}
                onChange={(e) => setPriceOrder(e.target.value)}
                className="w-full bg-transparent outline-none font-medium"
              >
                <option value="">{t('sort_by_price')}</option>
                <option value="asc">{t('low_to_high')}</option>
                <option value="desc">{t('high_to_low')}</option>
              </select>
            </div>

            {/* ترتيب حسب التقييم */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}>
              <span className="text-xl">⭐</span>
              <select
                value={ratingOrder}
                onChange={(e) => setRatingOrder(e.target.value)}
                className="w-full bg-transparent outline-none font-medium"
              >
                <option value="">{t('sort_by_rating')}</option>
                <option value="high">{t('highest_rating')}</option>
                <option value="low">{t('lowest_rating')}</option>
              </select>
            </div>
          </div>



        <h3 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-purple-900'}`}>
          {t('products')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {filteredProducts.length === 0 && (
            <p className={`col-span-full text-center font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {t('no_products_found')}
            </p>
          )}
          {filteredProducts.map(product => (
            <div
              key={product._id}
              className={`rounded-xl shadow-lg p-5 flex flex-col items-center cursor-pointer transition-shadow duration-300 hover:shadow-2xl ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
            >
              <img
                src={product.image || 'https://dummyimage.com/150x150/000/fff.png&text=No+Image'}
                alt={getLocalizedText(product.name)}
                className="w-full h-44 object-cover rounded-lg mb-4"
                onClick={() => openRatingModal(product)}
              />
              <h4 className="font-semibold text-center text-yellow-400">
                {getLocalizedText(product.name)}
              </h4>

              {/* عرض نوع البيع تحت اسم المنتج */}
              <p className="text-center text-sm text-gray-400 mb-1">
                {t('type_of_sale_label') || 'نوع البيع'}: <span className="font-semibold">{saleType}</span>
              </p>

              <div className="mb-2 text-center">
                <div className="inline-block">
                  {renderStars(Math.round(averageRatings[product._id]?.average || 0))}
                </div>
                <span className="ml-2 text-sm text-gray-400">
                  ({averageRatings[product._id]?.count || 0} {t('reviews')})
                </span>
              </div>

              {/* السعر حسب نوع البيع المختار */}
              <p className="font-bold mt-1 text-center text-yellow-300">
                {saleType === 'مفرق' ? product.priceRetail : product.priceWholesale} {t('currency')}
              </p>

              <div className="flex gap-3 mt-4 w-full justify-center">
                <button
                  onClick={() => openRatingModal(product)}
                  className="px-6 py-2 rounded-lg shadow transition bg-purple-700 text-white hover:bg-purple-800"
                >
                  {t('add_review')}
                </button>

                <button
                  onClick={() => openAddToCartModal(product)}
                  className="px-6 py-2 rounded-lg shadow transition bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                >
                  {t('add_to_cart')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* مودال التقييم */}
        {showRatingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className={`bg-white rounded-lg p-6 w-11/12 max-w-lg ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
              <h3 className="text-2xl font-bold mb-4">{t('add_review')}</h3>

              <div className="mb-4">
                <label className="block mb-1 font-semibold">{t('rating')}</label>
                <div>{renderInteractiveStars()}</div>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-semibold">{t('review')}</label>
                <textarea
                  rows={4}
                  className="w-full p-2 border rounded"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={submitRating}
                  className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
                >
                  {t('submit')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* مودال إضافة للسلة */}
        {showAddToCartModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className={`rounded-lg p-6 w-11/12 max-w-md shadow-xl transition-all duration-300 ${
      darkMode ? 'bg-gray-900 text-white border border-gray-700' : 'bg-white text-gray-900'
    }`}>
      <h3 className="text-2xl font-bold mb-4">{t('add_to_cart')}</h3>

      <p className="mb-4 font-semibold">{getLocalizedText(selectedProduct?.name)}</p>

      <label className="block mb-2 font-semibold">{t('quantity')}</label>
      <input
        type="number"
        min={saleType === "جملة" ? 12 : 1}
        value={quantity}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (saleType === "جملة" && val < 12) {
            setQuantity(12);
          } else {
            setQuantity(val);
          }
        }}
        className={`w-full p-2 border rounded mb-4 transition ${
          darkMode
            ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
            : 'bg-white text-black border-gray-300'
        }`}
        placeholder={t('enter_quantity')}
      />

      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowAddToCartModal(false)}
          className={`px-4 py-2 rounded hover:opacity-90 transition ${
            darkMode ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black'
          }`}
        >
          {t('cancel')}
        </button>
        <button
          onClick={confirmAddToCart}
          className="px-4 py-2 bg-yellow-500 text-purple-900 rounded hover:bg-yellow-600 transition"
        >
          {t('confirm')}
        </button>
      </div>
    </div>
  </div>
)}


        {/* مودال السلة (تنبيه) */}
        {showCartModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className={`bg-white rounded-lg p-6 w-96 ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
              <h3 className="text-xl font-bold mb-4">{t('added_to_cart')}</h3>
              <p>{t('product_added_to_cart_successfully')}</p>
              <div className="flex justify-end mt-6">
                <button
                  onClick={closeCartModal}
                  className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* توست التنبيه */}
        {showToast && (
          <div className="fixed bottom-6 right-6 bg-yellow-400 text-purple-900 px-6 py-3 rounded shadow-lg animate-fade-in-out z-50">
            {toastMessage}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in-out {
          0%, 100% {opacity: 0;}
          10%, 90% {opacity: 1;}
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default SectionDetails;
