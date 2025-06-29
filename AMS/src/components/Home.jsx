import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../i18n";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../ThemeContext";
import axios from "axios";

function SampleNextArrow(props) {
  const { onClick } = props;
  const { darkMode } = useContext(ThemeContext);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Next Slide"
      className={`absolute top-1/2 -translate-y-1/2 right-5 z-30 flex items-center justify-center w-14 h-14 rounded-full transition duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
        darkMode
          ? "bg-yellow-500 bg-opacity-80 hover:bg-opacity-100 focus:ring-yellow-400 text-gray-900 shadow-lg"
          : "bg-pink-600 bg-opacity-80 hover:bg-opacity-100 focus:ring-pink-400 text-yellow-100 shadow-lg"
      }`}
      style={{ filter: "drop-shadow(0 0 5px rgba(0,0,0,0.3))" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  const { darkMode } = useContext(ThemeContext);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous Slide"
      className={`absolute top-1/2 -translate-y-1/2 left-5 z-30 flex items-center justify-center w-14 h-14 rounded-full transition duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
        darkMode
          ? "bg-yellow-500 bg-opacity-80 hover:bg-opacity-100 focus:ring-yellow-400 text-gray-900 shadow-lg"
          : "bg-pink-600 bg-opacity-80 hover:bg-opacity-100 focus:ring-pink-400 text-yellow-100 shadow-lg"
      }`}
      style={{ filter: "drop-shadow(0 0 5px rgba(0,0,0,0.3))" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

function Home() {
  const { t, i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext);
  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    axios
      .get("https://my-backend-dgp2.onrender.com/api/slider")
      .then((res) => {
        const uniqueSliders = Array.from(
          new Map(res.data.map((item) => [item._id, item])).values()
        );
        setSliders(uniqueSliders);
      })
      .catch((err) => console.error("Failed to fetch sliders:", err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    pauseOnHover: false,
    pauseOnFocus: false,
    cssEase: "ease-in-out",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    appendDots: (dots) => (
      <div className="mt-6">
        <ul className="flex justify-center space-x-5">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <button
        type="button"
        className={`
          w-5 h-5 rounded-full transition-all duration-500
          ${
            darkMode
              ? "bg-yellow-400 opacity-50 hover:opacity-90 shadow-md"
              : "bg-pink-600 opacity-50 hover:opacity-90 shadow-md"
          }
        `}
        style={{
          boxShadow:
            "0 0 8px 3px rgba(0, 0, 0, 0.15)",
          background:
            darkMode
              ? "radial-gradient(circle at center, #fbbf24, #b45309)"
              : "radial-gradient(circle at center, #ec4899, #9d174d)",
        }}
        aria-label={`Go to slide ${i + 1}`}
      />
    ),
  };

  const cloudName = "dn93jrkma";

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }
    return `https://res.cloudinary.com/${cloudName}/image/upload/${img}`;
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
          className={`text-2xl font-extrabold max-w-3xl mx-auto tracking-wide drop-shadow-lg ${
            darkMode ? "text-yellow-300" : "text-white"
          }`}
        >
          {t("welcome")}
        </h3>

        <div
          className={`w-full rounded-3xl overflow-hidden shadow-2xl relative max-w-5xl ${
            darkMode ? "ring-4 ring-yellow-400/80" : "ring-4 ring-pink-400/70"
          }`}
          style={{ boxShadow: darkMode ? "0 0 20px #fbbf24aa" : "0 0 20px #ec4899aa" }}
        >
          <Slider {...settings}>
            {sliders.map((slide) => {
              const imageUrl = getImageUrl(slide.image);
              return (
                <div
                  key={slide._id}
                  className="relative cursor-pointer"
                  style={{ position: "relative" }}
                >
                  <img
                    src={imageUrl}
                    alt={slide.description?.[i18n.language] || "Slider"}
                    className="w-full h-72 md:h-96 object-cover rounded-3xl shadow-xl transition-transform duration-700 ease-in-out hover:scale-105 slider-image"
                    loading="lazy"
                    draggable={false}
                  />
                  <div
                    className={`slider-description absolute bottom-6 left-6 right-6 rounded-xl p-5 text-lg font-semibold transition-opacity duration-700 ease-in-out shadow-2xl ${
                      darkMode
                        ? "bg-yellow-500 bg-opacity-90 text-gray-900"
                        : "bg-pink-600 bg-opacity-85 text-yellow-100"
                    } opacity-0`}
                    style={{ backdropFilter: "blur(6px)" }}
                  >
                    {slide.description?.[i18n.language] || ""}
                  </div>
                  {/* Gradient overlay for text */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20 rounded-b-3xl pointer-events-none"
                    style={{
                      background: darkMode
                        ? "linear-gradient(to top, rgba(252,211,77,0.85), transparent)"
                        : "linear-gradient(to top, rgba(236,72,153,0.8), transparent)",
                    }}
                  />
                </div>
              );
            })}
          </Slider>
        </div>

        <Link to="/services" tabIndex={0}>
          <button
            className={`px-10 py-3 rounded-full font-bold text-lg transition-colors duration-500 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
              darkMode
                ? "bg-yellow-400 hover:bg-yellow-300 text-gray-900 focus:ring-yellow-500 focus:ring-offset-gray-900"
                : "bg-pink-600 hover:bg-pink-700 text-yellow-100 focus:ring-pink-400 focus:ring-offset-yellow-200"
            } shadow-lg`}
          >
            {t("go_to_services")}
          </button>
        </Link>
      </main>

      {/* ستايل التلاشي للصورة والوصف والنقاط */}
      <style>{`
        .slick-slide {
          position: relative;
        }
        .slick-slide.slick-active img.slider-image,
        .slick-slide.slick-active .slider-description {
          opacity: 1 !important;
          transition: opacity 700ms ease-in-out;
        }
        img.slider-image {
          opacity: 0;
          transition: opacity 700ms ease-in-out;
        }
        .slider-description {
          opacity: 0;
          pointer-events: none;
          transition: opacity 700ms ease-in-out;
        }
        .slick-slide.slick-active .slider-description {
          pointer-events: auto;
        }

        /* تنسيق نقاط التنقل */
        ul.slick-dots {
          bottom: 20px;
        }
        ul.slick-dots li button {
          border: none;
          padding: 0;
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.4s ease;
          box-shadow: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: transparent;
          position: relative;
          overflow: visible;
        }
        ul.slick-dots li.slick-active button {
          opacity: 1;
          box-shadow:
            0 0 15px 5px ${darkMode ? "rgba(252,211,77,0.8)" : "rgba(236,72,153,0.8)"};
          background-color: ${darkMode ? "#fcd34d" : "#ec4899"};
        }
        ul.slick-dots li button::before {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Home;
