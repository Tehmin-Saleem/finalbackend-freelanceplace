import React from "react";
import Carouselleft from "../../svg/ProfileView/Carouselleft";
import Crouselright from "../../svg/ProfileView/Crouselright";
import "./Carousel.scss";

const Carousel = ({ cards, currentIndex, handleNext, handlePrev }) => {
  return (
    <div className="Carousel">
      <div className="navigation prev" onClick={handlePrev}>
        {/* Left arrow SVG */}
        <Carouselleft />
      </div>
      <div className="cards-container">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`PortfolioCard ${
              index === currentIndex ? "active" : ""
            }`}
          >
            {/* Card content */}
            <img
              src={card.image}
              alt="Portfolio Image"
              className="PortfolioCardImage"
              onClick={() => handlePortfolioClick(card.id)}
            />
            <p className="PortfolioCardText">{card.title}</p>
            <p className="PortfolioCardsubtext">{card.description}</p>
          </div>
        ))}
      </div>
      <div className="navigation next" onClick={handleNext}>
        {/* Right arrow SVG */}
        <Crouselright />
      </div>
    </div>
  );
};

export default Carousel;
