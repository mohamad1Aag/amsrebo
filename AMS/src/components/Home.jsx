import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '../i18n';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from "../ThemeContext";
import axios from "axios";

// أزرار التحكم للسلايدر (مثل ما عندك)
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: 10, zIndex: 2 }}
      onClick={onClick}
      aria-label="Next Slide"
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: 10, zIndex: 2 }}
      onClick={onClick}
      aria-label="Previous Slide"
    />
  );
}

function Home() {
  const { t, i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    // جلب بيانات السلايدر من السيرفر
    axios.get("https://my-backend-dgp2.onrender.com/api/slider/list")
      .then(res => {
        setSliders(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch sliders:", err);
      });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-200 text-gray-900"
      }`}
    >
      <Header />

      <main className="flex-grow flex flex-col justify-center items-center px-6 text-center space-y-6 max-w-5xl mx-auto w-full py-8">
        <h3
          className={`text-xl md:text-2xl font-semibold max-w-3xl mx-auto tracking-wide drop-shadow-lg ${
            darkMode ? "text-yellow-300" : "text-white"
          }`}
        >
          {t("welcome")}
        </h3>

        {/* سلايدر الصور مع الوصف حسب اللغة */}
        <div
          className={`w-full rounded-3xl overflow-hidden shadow-2xl ${
            darkMode ? "ring-4 ring-yellow-400/70" : "ring-4 ring-pink-400/60"
          }`}
        >
          <Slider {...settings}>
            {sliders.map((slide) => (
              <div
                key={slide._id}
                className="relative transform hover:scale-105 transition-transform duration-700 ease-in-out"
              >
                <img
                  src={slide.image}
                  alt={slide.description[i18n.language] || "Slider image"}
                  className="w-full h-56 md:h-72 object-cover rounded-3xl"
                  loading="lazy"
                  draggable={false}
                />
                {/* صندوق الوصف */}
                <div
                  className={`absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-md p-3 text-white text-sm md:text-base ${
                    darkMode ? "bg-opacity-70" : "bg-opacity-50"
                  }`}
                >
                  {slide.description[i18n.language] || ""}
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <Link to="/services" tabIndex={0}>
          <button
            className={`px-8 py-2 rounded-full font-semibold text-base transition-colors duration-500 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
              darkMode
                ? "bg-yellow-400 hover:bg-yellow-300 text-gray-900 focus:ring-yellow-500 focus:ring-offset-gray-900"
                : "bg-pink-600 hover:bg-pink-700 text-yellow-100 focus:ring-pink-400 focus:ring-offset-yellow-200"
            }`}
          >
            {t("go_to_services")}
          </button>
        </Link>
      </main>
    </div>
  );
}

export default Home;
