import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { water } from "../../assets";

const AutoSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % slides.length);
    setFocused(false);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + slides.length) % slides.length);
    setFocused(false);
  };

  const handleFocus = () => {
    setFocused(!focused);
  };

  const getSlidePosition = (index) => {
    if (index === currentIndex) return "z-10 scale-110";
    if (index === (currentIndex - 1 + slides.length) % slides.length)
      return "z-0 -translate-x-[50%] opacity-70";
    if (index === (currentIndex + 1) % slides.length)
      return "z-0 translate-x-[50%] opacity-70";
    return "hidden";
  };

  return (
    <div
      className="relative w-full h-[50vh] md:h-[90vh] overflow-hidden bg-white px-4 md:px-10"
      style={{
        backgroundImage: `url(${water})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-white md:flex hidden"></div>
      <div className="relative w-full h-full flex items-center justify-center">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute transition-transform duration-700 ease-in-out pl-4 pr-4 group ${getSlidePosition(
              index
            )} transform`}
          >
            <div
              className={`relative w-full max-w-4xl md:max-w-3xl sm:max-w-sm h-auto rounded-xl overflow-hidden shadow-xl 
          transition-transform duration-500 
          ${
            index === currentIndex && focused
              ? "ring-4 ring-orange-500 scale-75"
              : ""
          }`}
              onClick={handleFocus}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-[250px] md:w-[800px] md:h-[500px] object-cover cursor-pointer transition-all duration-500 ease-in-out group-hover:scale-105" // Adjusted for mobile
              />
              <div className="absolute inset-0 md:w-1/2 w-full bg-gradient-to-r from-black/60 to-white/5 p-4 md:p-8 flex flex-col justify-center text-white">
                <h2 className="text-3xl md:text-4xl sm:text-2xl font-bold transition-all duration-500 ease-in-out group-hover:scale-95">
                  {" "}
                  {/* Adjusted for mobile */}
                  {slide.title}
                </h2>
                <p className="mt-2 text-lg w-full md:text-base sm:text-sm transition-all duration-500 ease-in-out group-hover:scale-95">
                  {" "}
                  {/* Adjusted for mobile */}
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute hidden md:flex top-1/2 left-4 md:left-6 transform -translate-y-1/2 bg-white text-gray-800 p-3 md:p-4 rounded-full shadow-xl hover:bg-gray-200 transition"
      >
        <FaArrowLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute hidden md:flex top-1/2 right-4 md:right-6 transform -translate-y-1/2 bg-white text-gray-800 p-3 md:p-4 rounded-full shadow-xl hover:bg-gray-200 transition"
      >
        <FaArrowRight size={24} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute md:hidden bottom-0 mt-10 pb-3 md:mt-20 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 md:gap-4 lg:gap-5">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`${
              index === currentIndex ? "bg-orange-500 scale-110" : "bg-white"
            } 
          transition-transform cursor-pointer w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AutoSlider;
