import React from 'react';
import DashboardImage from '../../images/Dashboard.png';
import "./styles.scss";
const ZoomedImage = () => {
  return (
    <div className="image-container">
      <img src={DashboardImage} alt="Zoomed" className="zoomed-image" />
    </div>
  );
};

export default ZoomedImage;
