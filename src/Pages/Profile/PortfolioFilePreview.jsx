// PortfolioFilePreview.jsx
import React from 'react';
import { useState, useEffect } from "react";
const PortfolioFilePreview = ({ file, fileUrl }) => {
  if (!file && !fileUrl) return null;

  // Handle base64 string from stored data
  if (fileUrl) {
    if (fileUrl.startsWith('data:image')) {
      return (
        <img
          src={fileUrl}
          alt="Portfolio Preview"
          className='bg-black'
          style={{ width: '100%', height: '200px', border: 'none' }}
        />
      );
    }

    if (fileUrl.startsWith('data:application/pdf')) {
      return (
        <iframe
          src={fileUrl}
          title="PDF Preview"
          style={{ width: '100%', height: '200px', border: 'none' }}
        />
      );
    }
  }

  // Handle newly uploaded file
  if (file) {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      return (
        <img
          src={url}
          alt="Portfolio Preview"
          style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
          onLoad={() => URL.revokeObjectURL(url)}
        />
      );
    }

    if (file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      return (
        <iframe
          src={url}
          title="PDF Preview"
          style={{ width: '100%', height: '200px', border: 'none' }}
          onLoad={() => URL.revokeObjectURL(url)}
        />
      );
    }
  }

  return (
    <div className="thumbnail-placeholder bg-black">
      <span>No Preview Available</span>
    </div>
  );
};

export default PortfolioFilePreview;