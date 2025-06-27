import React, { useContext, useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Header from '../Header';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../ThemeContext';

export default function UserProfile() {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSuccess = () => {
    setSuccessMessage(t('welcome_back'));
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };

  const handleRegisterSuccess = () => {
    setSuccessMessage(t('thank_you_for_registering'));
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };

  return (
    <>
      <Header />
      <div
        className={`min-h-screen flex items-center justify-center p-8 ${
          darkMode
            ? 'bg-gray-900 text-white'
            : 'bg-gradient-to-r from-purple-900 via-purple-700 to-pink-600 text-black'
        }`}
      >
        <div
          className={`rounded-2xl shadow-2xl p-10 max-w-lg w-full ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-purple-900'
          }`}
        >
          {successMessage ? (
            <div className="text-center text-2xl font-semibold p-6 text-green-500">
              {successMessage}
              <p className="mt-2 text-base text-gray-700 dark:text-gray-300">
                {t('redirecting_home')}
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold mb-8 text-center">
                {t('login')}
              </h2>
              <LoginForm onLoginSuccess={handleLoginSuccess} />

              <hr className="my-12 border-purple-300" />

              <h2 className="text-3xl font-extrabold mb-8 text-center">
                {t('register')}
              </h2>
              <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
