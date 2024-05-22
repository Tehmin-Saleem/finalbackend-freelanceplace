import React from "react";
import Carouselleft from "../svg/ProfileView/Carouselleft";
import Crouselright from "../svg/ProfileView/Crouselright";

const Carousel = ({ cards, currentIndex, handleNext, handlePrev }) => {
  return (
    <div className="Carousel">
      <div className="navigation" onClick={handlePrev}>
        {/* Left arrow SVG */}
        <Carouselleft />
      </div>
      {cards.map((card, index) => (
        <div
          key={index}
          className={`PortfolioCard ${index === currentIndex ? "active" : ""}`}
        >
          {/* Card content */}
        </div>
      ))}
      <div className="navigation" onClick={handleNext}>
        {/* Right arrow SVG */}
        <Crouselright />
      </div>
    </div>
  );
};

export default Carousel;

{
  /* <div className="Carousel">
      {cards.map((card, index) => (
        <div key={index} className="PortfolioCard">
          <img
            src={card.image}
            alt="Portfolio Image"
            className="PortfolioCardImage"
            onClick={() => handlePortfolioClick(card.id)}
          />
          <p className="PortfolioCardText">{card.title}</p>
          <p>{card.description}</p>
        </div>
      ))}
    </div> */
}
