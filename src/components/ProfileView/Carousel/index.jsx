import React, { useState, useEffect } from "react";
import { Carouselleft, Crouselright } from "../../../svg";
import "./styles.scss";

const Carousel = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3); // Default cards per view

  // Update cards per view based on window width
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.max(prevIndex - 1, 0);
      return newIndex;
    });
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, cards.length - cardsPerView);
      const newIndex = Math.min(prevIndex + 1, maxIndex);
      return newIndex;
    });
  };

  const canGoNext = currentIndex < cards.length - cardsPerView;
  const canGoPrev = currentIndex > 0;

  const handleFileClick = (fileUrl) => {
    if (fileUrl.startsWith('data:application/pdf')) {
      const pdfDataUrl = fileUrl.startsWith('data:')
        ? fileUrl
        : `data:application/pdf;base64,${fileUrl}`;
      const pdfWindow = window.open();
      if (pdfWindow) {
        pdfWindow.document.write(
          `<iframe width='100%' height='100%' src='${pdfDataUrl}'></iframe>`
        );
      }
    } else if (fileUrl.startsWith('data:image')) {
      const imageDataUrl = fileUrl.startsWith('data:')
        ? fileUrl
        : `data:${fileType};base64,${fileUrl}`;
      window.open(imageDataUrl, '_blank');
    } else {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="carousel-wrapper">
      <div className="carousel-container">
        <button
          className={`carousel-arrow left ${!canGoPrev ? 'disabled' : ''}`}
          onClick={goToPrevSlide}
          disabled={!canGoPrev}
        >
          <Carouselleft />
        </button>

        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="carousel-card cursor-pointer"
                style={{ width: `${100 / cardsPerView}%` }}
                onClick={() => handleFileClick(card.attachment)}
              >
                <div className="card-inner">
                  {card.attachment && (
                    card.attachment.toLowerCase().endsWith('.pdf') ? (
                      <div className="pdf-container">
                        <a
                          href={card.attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pdf-link"
                        >
                          View PDF
                        </a>
                      </div>
                    ) : (
                      <img
                        src={card.attachment}
                        alt={card.project_title || `Portfolio item ${index + 1}`}
                        className="card-image"
                      />
                    )
                  )}
                  <h3 className="card-title">{card.project_title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className={`carousel-arrow right ${!canGoNext ? 'disabled' : ''}`}
          onClick={goToNextSlide}
          disabled={!canGoNext}
        >
          <Crouselright />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
