import React from 'react';
import './styles.scss';
import { Notifications } from '../../svg';

const NotificationItem = ({ notification }) => {
  const { title, message, timestamp } = notification; // Use 'timestamp' instead of 'dateTime'

  // Format the date for display
  const formatDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / 60000);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 2880) { // Less than 2 days ago
      return 'Yesterday';
    } else {
      return notificationDate.toLocaleDateString(); // Display as standard date
    }
  };

  return (
    <div className="notification-item">
      <div className="notification-icon">
        <Notifications />
      </div>
      <div className="notification-content">
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      <div className="notification-time">
        <span>{formatDate(timestamp)}</span> {/* Use formatDate to display time */}
      </div>
    </div>
  );
};

export default NotificationItem;
