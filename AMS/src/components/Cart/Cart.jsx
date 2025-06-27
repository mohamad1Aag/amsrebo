import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MapModal from './MapModal';
import Header from '../Header';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../ThemeContext';

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

function Cart() {
  const [cart, setCart] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedLocation = localStorage.getItem('deliveryLocation');
    if (savedLocation) setDeliveryLocation(JSON.parse(savedLocation));
  }, []);

  const removeFromCart = (indexToRemove) => {
    const updatedCart = cart.filter((_, idx) => idx !== indexToRemove);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!deliveryLocation) {
      alert(t('please_select_location'));
      return;
    }

    const token = localStorage.getItem('userToken');
    if (!token) {
      alert(t('please_login_first'));
      navigate('/login');
      return;
    }

    const payload = parseJwt(token);
    if (!payload || !payload.id) {
      alert(t('invalid_token'));
      navigate('/login');
      return;
    }

    const userId = payload.id;
    const totalPrice = calculateTotal();

    if (cart.length === 0) {
      alert(t('cart_empty'));
      return;
    }

    try {
      // جلب بيانات المستخدم للتحقق من النقاط
      const userRes = await fetch(`https://my-backend-dgp2.onrender.com/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      if (!userRes.ok) throw new Error('فشل في تحميل بيانات المستخدم');

      const userPoints = userData.point || 0;

      if (userPoints < totalPrice) {
        alert(`رصيدك غير كافٍ (${userPoints}) لإتمام الطلب (${totalPrice}). سيتم تحويلك إلى صفحة الشحن.`);
        navigate('/wallet');
        return;
      }

      // تجهيز بيانات المنتجات بشكل متوافق مع الـ backend
      const productsForOrder = cart.map((item) => ({
        productId: item._id || item.id || item.productId,
        vendorId: item.adminId || item.vendorId || null,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        type: item.type || 'مفرق',
      }));

      // إنشاء الطلب في الـ backend
      const orderRes = await fetch('https://my-backend-dgp2.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          products: productsForOrder,
          deliveryLocation,
          notes: '',
        }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || 'فشل إنشاء الطلب');
      }

      // خصم النقاط بعد إنشاء الطلب
      const patchRes = await fetch(`https://my-backend-dgp2.onrender.com/api/users/pointcart/${userId}/points`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ point: userPoints - totalPrice }),
      });

      if (!patchRes.ok) {
        const errData = await patchRes.json();
        throw new Error(errData.message || 'خطأ في خصم النقاط');
      }

      alert(t('order_success')); // مثلاً "تم إنشاء الطلب وخصم النقاط بنجاح"
      setCart([]);
      setDeliveryLocation(null);
      localStorage.removeItem('cart');
      localStorage.removeItem('deliveryLocation');
      navigate('/');
    } catch (error) {
      alert(t('server_error'));
      console.error(error);
    }
  };

  if (cart.length === 0)
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-purple-100 text-black'}`}>
        <Header />
        <p className="text-center mt-20 font-semibold text-xl">🛒 {t('cart_empty')}</p>
      </div>
    );

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-200 text-black'
      }`}
    >
      <Header />

      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-center drop-shadow">🛒 {t('cart')}</h2>

        <div className="space-y-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-lg p-5 flex items-center gap-6 hover:shadow-2xl transition-shadow duration-300 ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
            >
              <img
                src={item.image || 'https://dummyimage.com/100x100/000/fff.png&text=No+Image'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-grow">
                <h4 className="text-xl font-semibold mb-1">{item.name}</h4>
                <p>
                  {t('quantity')}: <span className="font-medium">{item.quantity}</span>
                </p>
                <p>
                  {t('type_of_sale')}: <span className="font-medium">{item.type}</span>
                </p>
                <p className="mt-2 font-bold">
                  {t('total_price')}: {item.price * item.quantity} {t('currency')}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(index)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
                aria-label={`${t('remove')} ${item.name}`}
              >
                {t('remove')}
              </button>
            </div>
          ))}
        </div>

        <h3 className="text-right mt-10 text-2xl font-semibold drop-shadow">
          {t('total')}: <span className="font-bold">{calculateTotal()} {t('currency')}</span>
        </h3>

        <div className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-6">
          <button
            onClick={() => setIsMapOpen(true)}
            className="bg-purple-900 hover:bg-purple-950 text-yellow-300 px-8 py-3 rounded-full shadow-lg transition font-bold"
          >
            📍 {t('choose_location')}
          </button>

          {deliveryLocation && (
            <button
              onClick={handlePlaceOrder}
              className="bg-green-600 hover:bg-green-700 text-yellow-300 px-8 py-3 rounded-full shadow-lg transition font-bold"
            >
              ✅ {t('confirm_order')}
            </button>
          )}
        </div>

        {deliveryLocation && (
          <p className="mt-6 text-center font-semibold drop-shadow">
            📌 {t('selected_location')}: ({deliveryLocation.lat.toFixed(5)}, {deliveryLocation.lng.toFixed(5)})
          </p>
        )}

        <MapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onConfirmLocation={(confirmedLocation) => {
            setDeliveryLocation(confirmedLocation);
            localStorage.setItem('deliveryLocation', JSON.stringify(confirmedLocation));
            alert(`${t('location_selected')}: ${confirmedLocation.lat}, ${confirmedLocation.lng}`);
            setIsMapOpen(false);
          }}
        />
      </div>
    </div>
  );
}

export default Cart;
