
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles.scss";
import NotificationItem from "../../components/NotificationItem";
import { NotificationContext } from './NotificationContext';
import Header from "../../components/Commoncomponents/Header";

const Notification = () => {
    const { notifications, unreadCount, fetchNotifications, markAsRead } = useContext(NotificationContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);
    
    const handleNotificationClick = async (notification) => {
        if (notification.job_id) {
            if (!notification.is_read) {
                await markAsRead(notification._id);
            }
            navigate(`/offerdetails`);
        }
    };

    const formatNotificationTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const groupNotificationsByDate = (notifications) => {
        const groups = {};
        notifications.forEach(notification => {
            const date = new Date(notification.timestamp).toLocaleDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(notification);
        });
        return groups;
    };

    return (
        <>
        <Header />
        <div className="notification-page">
            <h1>Notifications</h1>
            <p>You have {unreadCount} unread notifications.</p>
            {notifications.length > 0 ? (
                Object.entries(groupNotificationsByDate(notifications)).map(([date, notifs]) => (
                    <div key={date}>
                        <h2>{date === new Date().toLocaleDateString() ? 'Today' : date}</h2>
                        {notifs.map((notification) => (
                            <div
                                key={notification._id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`notification-item ${notification.is_read ? 'read-notification' : 'unread-notification'}`}
                            >
                                <NotificationItem
                                    notification={notification}
                                    time={formatNotificationTime(notification.timestamp)}
                                />
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>No notifications to display.</p>
            )}
        </div>
        </>
    );
};

export default Notification;