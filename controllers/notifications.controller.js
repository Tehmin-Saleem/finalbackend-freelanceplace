const Notification = require('../models/notifications.model');

exports.createNotification = async (notificationData) => {
  try {
    console.log('Creating notification with data:', notificationData);
    const { client_id, freelancer_id, job_id, message } = notificationData;
    
    if (!client_id || !freelancer_id || !job_id) {
      console.error('Missing required fields:', { client_id, freelancer_id, job_id });
      throw new Error('Missing required fields');
    }

    const newNotification = new Notification({
      client_id,
      freelancer_id,
      job_id,
      message,
      timestamp: new Date(),
      is_read: false
    });

    const savedNotification = await newNotification.save();
    console.log('Notification saved successfully:', savedNotification);
    
    if (global.io) {
      console.log('Emitting new_offer event to:', freelancer_id.toString());
      global.io.to(freelancer_id.toString()).emit('new_offer', savedNotification);
    } else {
      console.error('Socket.IO instance not available');
    }
    
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming the decoded token is attached to req.user
    console.log('Fetching notifications for user:', userId);

    const notifications = await Notification.find({ freelancer_id: userId })
      .sort({ timestamp: -1 });

   

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.toString() });
  }
};

exports.getUnreadNotificationsCount = async (req, res) => {
  try {
    const userId = req.user.userId;
   

    const count = await Notification.countDocuments({
      freelancer_id: userId,
      is_read: false
    });

   
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