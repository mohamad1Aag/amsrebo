import React, { useContext } from 'react';
import Header from './Header';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../ThemeContext';

function About() {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  return (
    <>
      <Header />
      <div
        className={`min-h-screen py-10 px-2 sm:px-4 flex justify-center items-start overflow-hidden ${
          darkMode
            ? 'bg-gray-900 text-white'
            : 'bg-gradient-to-r from-[#4B0082] via-[#FF69B4] via-[#FFA07A] to-[#FFFACD] text-gray-900'
        }`}
      >
        <div
          className={`bg-opacity-90 shadow-md rounded-lg p-3 sm:p-6 md:p-8 lg:p-12 w-full max-w-4xl ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white'
          }`}
        >
          <header className="mb-8">
            <h1
              className="text-2xl sm:text-3xl font-bold text-center mb-4"
              style={{ color: darkMode ? '#E9D5FF' : '#5B21B6' }}
            >
              {t('about_title')}
            </h1>
            <hr
              className="border-t-2 w-20 sm:w-24 mx-auto"
              style={{ borderColor: '#F97316' }}
            />
          </header>

          <section className="mb-6">
            <h2
              className="text-lg sm:text-xl font-semibold mb-2"
              style={{ color: '#F97316' }}
            >
              🌍 {t('about_us')}
            </h2>
            <p className="leading-relaxed text-base sm:text-lg">
              {t('about_us_text')}
            </p>
          </section>

          <section className="mb-6">
            <h2
              className="text-lg sm:text-xl font-semibold mb-2"
              style={{ color: '#F97316' }}
            >
              🎯 {t('our_vision')}
            </h2>
            <p className="leading-relaxed text-base sm:text-lg">
              {t('our_vision_text')}
            </p>
          </section>

          <section className="mb-6">
            <h2
              className="text-lg sm:text-xl font-semibold mb-2"
              style={{ color: '#F97316' }}
            >
              💼 {t('our_services')}
            </h2>
            <ul
              className="list-disc list-inside space-y-1 text-base sm:text-lg"
            >
              <li>{t('delivery')}</li>
              <li>{t('vegetables')}</li>
              <li>{t('fruits')}</li>
              <li>{t('clothing_stationery')}</li>
            </ul>
          </section>

          <footer
            className="text-center text-sm sm:text-base mt-10 border-t pt-4"
            style={{
              color: '#14B8A6',
              borderColor: '#F97316',
            }}
          >
            © 2025 {t('ams_group')} - {t('all_rights_reserved')}
          </footer>
        </div>
      </div>
    </>
  );
}

export default About;
