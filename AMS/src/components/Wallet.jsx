import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';

function Wallet() {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header />

      <div className="max-w-xl mx-auto mt-20 p-6 rounded-xl shadow-xl bg-white dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-700 dark:text-purple-300">
          {t('recharge_wallet') || 'شحن الرصيد'}
        </h1>

        <p className="text-lg text-center mb-4">
          {t('insufficient_points_message') || 'رصيدك الحالي لا يكفي لإتمام الطلب. يرجى التواصل معنا لشحن الرصيد.'}
        </p>

        <div className="flex flex-col gap-4 mt-8">
          {/* زر واتساب */}
          <a
            href="https://wa.me/9630968603694" // ← ضع رقمك هنا مع رمز الدولة بدون +
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition"
          >
            <FaWhatsapp className="text-2xl" />
            {t('contact_whatsapp') || 'تواصل عبر واتساب'}
          </a>

          {/* زر تيليغرام */}
          <a
            href="https://t.me/mhmdsaidaag" // ← ضع رابط حسابك على تيليغرام هنا
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition"
          >
            <FaTelegram className="text-2xl" />
            {t('contact_telegram') || 'تواصل عبر تيليغرام'}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
