const Notification = require('../models/notifications.model');

exports.createNotification = async (notificationData) => {
  try {
    console.log('Creating notification with data:', notificationData);
    const { client_id, freelancer_id, job_id, message, type } = notificationData;

    if (!job_id || !type || (!client_id && !freelancer_id)) {
      console.error('Missing required fields:', { client_id, freelancer_id, job_id, type });
      throw new Error('Missing required fields');
    }

    const newNotification = new Notification({
      client_id,
      freelancer_id,
      job_id,
      message,
      type
    });

    const savedNotification = await newNotification.save();
    console.log('Notification saved successfully:', savedNotification);

    if (global.io) {
      let recipientId, recipientType;
      if (type === 'new_offer') {
        recipientId = freelancer_id;
        recipientType = 'freelancer';
      } else if (type === 'new_proposal') {
        recipientId = client_id;
        recipientType = 'client';
      }

      if (recipientId) {
        console.log(`Emitting ${type} to ${recipientType}:`, recipientId);
        global.io.to(`${recipientType}_${recipientId}`).emit('notification', {
          ...savedNotification.toObject(),
          type 
        });
      }
    }

    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};


exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;  // Assuming the user role is available in req.user
    console.log('Fetching notifications for user:', userId, 'Role:', userRole);

    let query = {};
    if (userRole === 'client') {
      query.client_id = userId;
    } else if (userRole === 'freelancer') {
      query.freelancer_id = userId;
    } else {
      return res.status(400).json({ message: 'Invalid user role' });
    }

    const notifications = await Notification.find(query).sort({ timestamp: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.toString() });
  }
};

exports.getUnreadNotificationsCount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role; 

    let query = { is_read: false };
    if (userRole === 'client') {
      query.client_id = userId;
    } else if (userRole === 'freelancer') {
      query.freelancer_id = userId;
    } else {
      return res.status(400).json({ message: 'Invalid user role' });
    }

    const count = await Notification.countDocuments(query);

    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    res.status(500).json({ message: 'Error fetching unread notifications count', error: error.message });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationId = req.params.notificationId;
 

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, freelancer_id: userId },
      { is_read: true },
      { new: true }
    );

    if (!notification) {
     
      return res.status(404).json({ message: 'Notification not found or not authorized' });
    }

    console.log('Notification updated successfully:', notification);
    res.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

// Middleware to check authentication
exports.checkAuth = (req, res, next) => {
  if (!req.user || !req.user.userId) {
    console.error('User not authenticated');
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};