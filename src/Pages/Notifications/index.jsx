import React from 'react';
import "./styles.scss";
import NotificationItem from "../../components/NotificationItem";
import Header from "../../components/Commoncomponents/Header";

const Notification = () => {
  const notifications = [
    {
      title: "Pending Task",
      message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      dateTime: "2024-08-29T08:30:00",
      read: false
    },
    {
      title: "Due Task Date",
      message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      dateTime: "2024-08-29T07:00:00",
      read: false
    },
    {
      title: "Lorem Ipsum",
      message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      dateTime: "2024-08-28T14:12:00",
      read: true
    },
    {
      title: "Lorem Ipsum",
      message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      dateTime: "2024-08-28T12:00:00",
      read: true
    },
    {
      title: "Lorem Ipsum",
      message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      dateTime: "2024-08-25T12:00:00",
      read: true
    }
  ];

  const todayNotifications = notifications.filter(notification => 
    new Date(notification.dateTime).toDateString() === new Date().toDateString()
  );

  const yesterdayNotifications = notifications.filter(notification => 
    new Date(notification.dateTime).toDateString() === new Date(Date.now() - 86400000).toDateString()
  );

  const restNotifications = notifications.filter(notification => 
    new Date(notification.dateTime).toDateString() !== new Date().toDateString() &&
    new Date(notification.dateTime).toDateString() !== new Date(Date.now() - 86400000).toDateString()
  );

  return (
    <>
      <Header />
      <div className="notification-page">
        <h1>Notification</h1>
        <p>You have {notifications.filter(n => !n.read).length} unread notifications.</p>

        <section className="notification-section">
          <h2>Today</h2>
          {todayNotifications.map((notification, index) => (
            <NotificationItem key={index} notification={notification} />
          ))}
        </section>

        <section className="notification-section">
          <h2>Yesterday</h2>
          {yesterdayNotifications.map((notification, index) => (
            <NotificationItem key={index} notification={notification} />
          ))}
        </section>

        <section className="notification-section">
          <h2>Earlier</h2>
          {restNotifications.map((notification, index) => (
            <NotificationItem key={index} notification={notification} />
          ))}
        </section>
      </div>
    </>
  );
};

export default Notification;
