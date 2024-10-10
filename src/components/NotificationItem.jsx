import React from 'react';
import { Link } from 'react-router-dom';

const NotificationItem = ({ notification, onRead }) => {
  const handleClick = () => {
    if (!notification.read) {
      onRead();
    }
    // Additional logic for handling the notification click
    // e.g., navigating to the offer details page for new offer notifications
  };

  return (
    <div className={`notification-item ${notification.read ? 'read' : 'unread'}`} onClick={handleClick}>
      <div className="notification-content">
        <h3>{notification.type === 'new_offer' ? 'New Offer' : 'Notification'}</h3>
        <p>{notification.message}</p>
        <span className="notification-time">{new Date(notification.createdAt).toLocaleString()}</span>
      </div>
      {notification.type === 'new_offer' && (
        <Link to={`/offer/${notification.offerId}`} className="view-offer-btn">
          View Offer
        </Link>
      )}
    </div>
  );
};

export default NotificationItem;