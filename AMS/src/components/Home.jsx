// import React from "react";
// import { Link } from "react-router-dom";
// import Header from "./Header";

// import Slider from "react-slick"; // استيراد السلايدر
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";


// import './i18n';
// import { useTranslation } from 'react-i18next';

// const images = [
//   "data:image/jpeg;base64,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",
//   "https://source.unsplash.com/800x300/?market",
//   "https://source.unsplash.com/800x300/?commerce",
//   "https://source.unsplash.com/800x300/?technology",
// ];

// function Home() {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 800,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3500,
//     arrows: false,
//     pauseOnHover: true,
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 flex flex-col">
//       <Header />

//       <div className="flex-grow flex flex-col justify-center items-center px-4 text-center space-y-6 max-w-5xl mx-auto w-full">
//         <h3 className="text-white text-2xl md:text-3xl font-semibold max-w-3xl mx-auto">
//           اهلا بكم في موقع <span className="font-bold">AMS.WEB</span> للتجارة العامة في مدينة سوريا محافظة اللاذقية
//         </h3>

//         {/* سلايدر الصور */}
//         <div className="w-full rounded-lg overflow-hidden shadow-lg">
//           <Slider {...settings}>
//             {images.map((src, index) => (
//               <div key={index}>
//                 <img
//                   src={src}
//                   alt={`Banner ${index + 1}`}
//                   className="w-full h-64 md:h-72 object-cover rounded-lg"
//                 />
//               </div>
//             ))}
//           </Slider>
//         </div>

        

//         <Link to="/services">
//           <button className="bg-purple-800 hover:bg-pink-600 text-yellow-100 font-bold py-3 px-8 rounded transition-colors">
//             الذهاب الي صفحة الخدمات
//           </button>
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Home;


import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

import Slider from "react-slick"; // استيراد السلايدر
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '../i18n';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from "../ThemeContext"; // تأكد من وجود هذا الملف

const images = [
  "data:image/jpeg;base64,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",
  "https://source.unsplash.com/800x300/?market",
  "https://source.unsplash.com/800x300/?commerce",
  "https://source.unsplash.com/800x300/?technology",
];

function Home() {
  const { t, i18n } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-100 text-black'} flex flex-col`}>
      <Header />

      <div className="flex-grow flex flex-col justify-center items-center px-4 text-center space-y-6 max-w-5xl mx-auto w-full">
        <h3 className="text-2xl md:text-3xl font-semibold max-w-3xl mx-auto">
          {t("welcome")}
        </h3>

        {/* سلايدر الصور */}
        <div className="w-full rounded-lg overflow-hidden shadow-lg">
          <Slider {...settings}>
            {images.map((src, index) => (
              <div key={index}>
                <img
                  src={src}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-64 md:h-72 object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>

        <Link to="/services">
          <button className="bg-purple-800 hover:bg-pink-600 text-yellow-100 font-bold py-3 px-8 rounded transition-colors">
            {t("go_to_services")}
          </button>
        </Link>
        <Link to="/my-orders" className="text-blue-600 underline hover:text-blue-800">
  مشاهدة طلباتي               
            </Link>

      </div>

    </div>
  );
}

export default Home;
