
import React, { createContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching notifications with token:', token);
            const response = await axios.get('http://localhost:5000/api/freelancer/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('NotificationContext: Fetched notifications:', response.data);
            if (Array.isArray(response.data)) {
                const sortedNotifications = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setNotifications(sortedNotifications);
                const unreadCount = sortedNotifications.filter(n => !n.is_read).length;
                setUnreadCount(unreadCount);
                console.log('Updated unread count:', unreadCount);
            } else {
                console.error('Unexpected response format:', response.data);
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error.response?.data || error.message);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/freelancer/notifications/unread-count', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('NotificationContext: Fetched unread count:', response.data.count);
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('NotificationContext: Error fetching unread count:', error.response?.data || error.message);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
        console.log('NotificationContext: Fetching initial notifications and unread count');

        const token = localStorage.getItem('token');
        const socket = io('http://localhost:5000', {
            query: { token }
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('authenticate', token);
        });

        socket.on('new_offer', (offerNotification) => {
            console.log('New offer received:', offerNotification);
            setNotifications(prev => [offerNotification, ...prev]);
            setUnreadCount(prevCount => prevCount + 1);
        });

        const intervalId = setInterval(() => {
            fetchNotifications();
            fetchUnreadCount();
        }, 60000);

        return () => {
            socket.disconnect();
            clearInterval(intervalId);
        };
    }, [fetchNotifications, fetchUnreadCount]);

    const markAsRead = async (notificationId) => {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`http://localhost:5000/api/freelancer/notifications/${notificationId}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
      
          setNotifications(prevNotifications =>
            prevNotifications.map(notif =>
              notif._id === notificationId ? { ...notif, is_read: true } : notif
            )
          );
      
          setUnreadCount(prevCount => Math.max(0, prevCount - 1));
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      };
    

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, fetchUnreadCount, fetchNotifications, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};