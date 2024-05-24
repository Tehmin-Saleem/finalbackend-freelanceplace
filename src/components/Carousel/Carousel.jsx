import { React, useState } from "react";
import Carouselleft from "../../svg/ProfileView/Carouselleft";
import Crouselright from "../../svg/ProfileView/Crouselright";
import "./styles.scss";

const Carousel = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = () => {
    const newIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNextSlide = () => {
    const newIndex = currentIndex === cards.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <>
      <div className="carousel-container">
        <div className=" mr-10"></div>
        <button className="carousel-arrow left" onClick={goToPrevSlide}>
          {/* Left arrow SVG */}
          <Carouselleft />
        </button>
        {/* cards-container */}
        <div className="carousel">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`PortfolioCard ${
                index === currentIndex ? "slide active" : "slide"
              }`}
            >
              {/* Card content */}
              <img
                src={card.image}
                alt={`Slide ${index}`}
                className="PortfolioCardImage"
              />
              <p className="PortfolioCardText">{card.title}</p>
              <p className="PortfolioCardsubtext">{card.description}</p>
            </div>
          ))}
        </div>
        <button className="carousel-arrow right" onClick={goToNextSlide}>
          <Crouselright />
        </button>
      </div>
    </>
  );
};

export default Carousel;
