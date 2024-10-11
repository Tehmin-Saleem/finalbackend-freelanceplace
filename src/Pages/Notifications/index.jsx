import React, { useState, useEffect } from 'react';
import "./styles.scss";
import NotificationItem from "../../components/NotificationItem";
import Header from "../../components/Commoncomponents/Header";
import SocketManager from './socket';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch initial notifications
    fetchNotifications();

    // Connect to Socket.IO
    const token = localStorage.getItem('token'); // Assuming you store the JWT in localStorage
    SocketManager.connect(token);

    // Listen for new notifications
    SocketManager.onNotification((newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
    });

    // Listen specifically for new offer notifications
    SocketManager.onNewOffer((offerNotification) => {
      // You can handle offer notifications differently if needed
      setNotifications(prev => [{
        ...offerNotification,
        read: false,
        createdAt: new Date().toISOString()
      }, ...prev]);
      
      // Optionally, you can show a more prominent alert for new offers
      alert(`New offer received: ${offerNotification.message}`);
    });

    return () => {
      SocketManager.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    // Fetch notifications from your API
    // Update the state with the fetched notifications
  };

  // Function to mark a notification as read
  const markAsRead = async (notificationId) => {
    // Implement the logic to mark a notification as read
    // This might involve an API call to update the notification status
    // Then update the local state
    setNotifications(notifications.map(notif =>
      notif._id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  return (
    <>
      <Header />
      <div className="notification-page">
        <h1>Notifications</h1>
        <p>You have {notifications.filter(n => !n.read).length} unread notifications.</p>

        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onRead={() => markAsRead(notification._id)}
          />
        ))}
      </div>
    </>
  );
};

export default Notification;