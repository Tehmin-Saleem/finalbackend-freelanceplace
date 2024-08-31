import React from 'react';
import './styles.scss';
import { Notifications } from '../../svg';

const NotificationItem = ({ notification }) => {
  const { title, message, dateTime } = notification;

  const formatDate = date => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / 60000);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hour ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <div className="notification-item">
      <div className="notification-icon">
        <Notifications/> 
      </div>
      <div className="notification-content">
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      <div className="notification-time">
        {formatDate(dateTime)}
      </div>
    </div>
  );
};

export default NotificationItem;
