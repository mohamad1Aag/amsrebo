import React, { useContext } from 'react';
import Header from './Header';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../ThemeContext';

function Contact() {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  return (
    <>
      <Header />
      <div
        className={`min-h-screen py-10 px-4 flex justify-center items-start ${
          darkMode
            ? 'bg-gray-900 text-white'
            : 'bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 text-gray-900'
        }`}
      >
        <div
          className={`${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          } bg-opacity-90 shadow-md rounded-lg p-6 md:p-8 lg:p-12 max-w-4xl w-full`}
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">
            {t('contact_us')}
          </h1>

          <p className="mb-8 text-center text-base sm:text-lg">
            {t('contact_intro')}{' '}
            <strong className="text-purple-800">AMS</strong> {t('contact_end')}
          </p>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-500">
              {t('contact_info')}
            </h2>
            <ul className="space-y-2 text-base sm:text-lg">
              <li>
                <strong>📍 {t('address')}:</strong> {t('contact_address')}
              </li>
              <li>
                <strong>📞 {t('phone')}:</strong> +9639999999999999
              </li>
              <li>
                <strong>📧 {t('email')}:</strong> info@servisedasdawd.com
              </li>
              <li>
                <strong>🕐 {t('working_hours')}:</strong> {t('contact_hours')}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-orange-500">
              {t('send_message')}
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder={t('full_name')}
                required
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"
              />
              <input
                type="email"
                placeholder={t('email')}
                required
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"
              />
              <textarea
                placeholder={t('your_message')}
                rows="5"
                required
                className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none text-black"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-purple-700 text-white py-3 rounded hover:bg-purple-800 transition-colors font-semibold"
              >
                {t('send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
