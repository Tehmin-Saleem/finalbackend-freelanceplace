// components/PortfolioModal/PortfolioModal.jsx
import React from 'react';
import './styles.scss';
import { Cross } from '../../../svg/index';

const PortfolioModal = ({ portfolio, onClose }) => {
  if (!portfolio) return null;

  return (
    <div className="portfolio-modal-overlay" onClick={onClose}>
      <div className="portfolio-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <Cross />
        </button>
        
        <div className="portfolio-modal-body">
          <div className="portfolio-header">
            <h2>{portfolio.project_title}</h2>
            <span className="category">{portfolio.category}</span>
          </div>

          {portfolio.attachment && (
            <div className="portfolio-image">
              <img 
                src={portfolio.attachment} 
                alt={portfolio.project_title}
                className="portfolio-attachment"
              />
            </div>
          )}

          <div className="portfolio-details">
            <div className="detail-section">
              <h3>Description</h3>
              <p>{portfolio.description}</p>
            </div>

            <div className="detail-section">
              <h3>Tools Used</h3>
              <p>{portfolio.tool_used}</p>
            </div>

            {portfolio.url && (
              <div className="detail-section">
                <h3>Project URL</h3>
                <a 
                  href={portfolio.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  Visit Project
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal;