
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
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const groups = {
            'Today': [],
            'Yesterday': [],
            'Earlier': []
        };
    
        notifications.forEach(notification => {
            const notificationDate = new Date(notification.timestamp).toDateString();
            if (notificationDate === today) {
                groups['Today'].push(notification);
            } else if (notificationDate === yesterday) {
                groups['Yesterday'].push(notification);
            } else {
                groups['Earlier'].push(notification);
            }
        });
    
        // Remove empty groups
        Object.keys(groups).forEach(key => {
            if (groups[key].length === 0) {
                delete groups[key];
            }
        });

        return groups;
    };

    const groupedNotifications = groupNotificationsByDate(notifications);

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