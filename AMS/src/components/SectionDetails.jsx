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
  const [type, setType] = useState('مفرق');

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [priceOrder, setPriceOrder] = useState('');
  const [ratingOrder, setRatingOrder] = useState('');

  const [ratingsByProduct, setRatingsByProduct] = useState({});
  const [averageRatings, setAverageRatings] = useState({});

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

  const openRatingModal = (product) => {
    setSelectedProduct(product);
    setNewRatingValue(0);
    setNewReviewText('');
    setShowRatingModal(true);
  };

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

  const openAddToCartModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setType('مفرق');
    setShowAddToCartModal(true);
  };

  const confirmAddToCart = () => {
    if (quantity < 1) {
      setToastMessage(t('please_select_valid_quantity'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // تخزين بيانات المنتج الأساسية مع السلة
    const newItem = {
      productId: selectedProduct._id,
      name: getLocalizedText(selectedProduct.name),
      price: selectedProduct.price,
      image: selectedProduct.image || 'https://dummyimage.com/150x150/000/fff.png&text=No+Image',
      quantity,
      type,
      adminId: selectedProduct.adminId || selectedProduct.vendorId || selectedProduct.ownerId || null, // إضافة adminId

    };

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.productId === selectedProduct._id && item.type === type
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

  const closeCartModal = () => {
    setShowCartModal(false);
    setQuantity(1);
    setType('مفرق');
  };

  const filteredProducts = [...products]
    .filter(product => getLocalizedText(product.name).toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (priceOrder === 'asc') return a.price - b.price;
      if (priceOrder === 'desc') return b.price - a.price;
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

        <div className="flex flex-col md:flex-row items-center gap-4 justify-between mb-8 mt-12">
          <input
            type="text"
            placeholder={t('search_products')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded border border-gray-600 bg-black text-white w-full md:w-1/3"
          />
          <select
            value={priceOrder}
            onChange={(e) => setPriceOrder(e.target.value)}
            className="px-4 py-2 rounded border border-gray-600 bg-black text-white"
          >
            <option value="">{t('sort_by_price')}</option>
            <option value="asc">{t('low_to_high')}</option>
            <option value="desc">{t('high_to_low')}</option>
          </select>
          <select
            value={ratingOrder}
            onChange={(e) => setRatingOrder(e.target.value)}
            className="px-4 py-2 rounded border border-gray-600 bg-black text-white"
          >
            <option value="">{t('sort_by_rating')}</option>
            <option value="high">{t('highest_rating')}</option>
            <option value="low">{t('lowest_rating')}</option>
          </select>
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

              <div className="mb-2 text-center">
                <div className="inline-block">
                  {renderStars(Math.round(averageRatings[product._id]?.average || 0))}
                </div>
                <span className="ml-2 text-sm text-gray-400">
                  ({averageRatings[product._id]?.count || 0} {t('reviews')})
                </span>
              </div>

              <p className="font-bold mt-1 text-center text-yellow-300">
                {product.price} {t('currency')}
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

        {showRatingModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4">{t('add_review')}</h3>
              <p className="mb-3"><strong>{t('product')}:</strong> {getLocalizedText(selectedProduct.name)}</p>

              <div className="mb-3 flex gap-1 justify-center">
                {renderInteractiveStars()}
              </div>

              <textarea
                rows={4}
                placeholder={t('write_your_review')}
                value={newReviewText}
                onChange={e => setNewReviewText(e.target.value)}
                className="w-full px-3 py-2 rounded text-black"
              />

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800"
                >
                  {t('close')}
                </button>
                <button
                  onClick={submitRating}
                  className="px-4 py-2 rounded bg-purple-700 hover:bg-purple-800"
                >
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddToCartModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4">{t('add_to_cart')}</h3>
              <p className="mb-3"><strong>{t('product')}:</strong> {getLocalizedText(selectedProduct.name)}</p>

              <label className="block mb-2">
                {t('quantity')}:
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                  className="ml-2 px-2 py-1 rounded text-black w-20"
                />
              </label>

              <label className="block mb-4">
                {t('type_of_sale')}:
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="ml-2 px-2 py-1 rounded text-black"
                >
                  <option value="مفرق">{t('retail')}</option>
                  <option value="جملة">{t('wholesale')}</option>
                </select>
              </label>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowAddToCartModal(false)}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={confirmAddToCart}
                  className="px-4 py-2 rounded bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                >
                  {t('add_to_cart')}
                </button>
              </div>
            </div>
          </div>
        )}

        {showCartModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4">{t('added_to_cart')}</h3>
              <img
                src={selectedProduct.image || 'https://dummyimage.com/150x150/000/fff.png&text=No+Image'}
                alt={getLocalizedText(selectedProduct.name)}
                className="w-32 h-32 object-cover rounded mb-4 mx-auto"
              />
              <p className="mb-3"><strong>{t('product')}:</strong> {getLocalizedText(selectedProduct.name)}</p>
              <p className="mb-3"><strong>{t('price')}:</strong> {selectedProduct.price} {t('currency')}</p>
              <p className="mb-3"><strong>{t('quantity')}:</strong> {quantity}</p>
              <p className="mb-3"><strong>{t('type_of_sale')}:</strong> {type}</p>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={closeCartModal}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800"
                >
                  {t('close')}
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="px-4 py-2 rounded bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                >
                  {t('go_to_cart')}
                </button>
              </div>
            </div>
          </div>
        )}

        {showToast && (
          <div className="fixed bottom-10 right-10 bg-yellow-400 text-purple-900 px-6 py-3 rounded shadow-lg z-50 animate-fade-in-out">
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
