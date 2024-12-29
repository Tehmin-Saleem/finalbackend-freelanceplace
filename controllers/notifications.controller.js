const Notification = require('../models/notifications.model');
const User= require('../models/user.model')
// Function to create a notification
exports.createNotification = async (notificationData) => {
  try {
    console.log('Creating notification with data:', notificationData);
    const {
      client_id,
      freelancer_id,
      consultant_id,
      job_id,
      message,
      type,
      receiver_id,
      senderId,
      admin_email,
    
    } = notificationData;

    // Validate required fields based on notification type
    if (type !== 'new_query' && !receiver_id) {
      console.error('Missing receiver_id for non-query notification');
      throw new Error('Missing receiver_id');
    }

    // For new_query type, we need admin_email
    if (type === 'new_query' && !admin_email) {
      console.error('Missing admin_email for query notification');
      throw new Error('Missing admin_email');
    }


    // Determine the recipient based on notification type
    let recipientId = receiver_id;
    if (type === 'new_query' && admin_email) {
      // Find admin by email
      const adminUser = await User.findOne({ email: admin_email, isAdmin: true });
      if (!adminUser) {
        console.error('Admin user not found with email:', admin_email);
        throw new Error('Admin user not found');
      }
      recipientId = adminUser._id;
    } else {
      // Regular notification routing logic
      if (!recipientId) {
        if (type === 'new_offer') {
          recipientId = consultant_id || freelancer_id;
        } else if (type === 'new_proposal') {
          recipientId = client_id;
        } else if (['hired', 'milestone_completed', 'payment_received'].includes(type)) {
          recipientId = freelancer_id;
        }
      }
    }

    console.log('Recipient ID:', recipientId, 'Sender ID:', senderId);


    if (type !== 'new_query' && recipientId && recipientId.toString() === senderId.toString()) {
      console.warn('NOTIFICATION BLOCKED: Recipient is the sender');
      return null;
    }
    // Create the notification payload
    const notificationPayload = {
      client_id: client_id || null,
      freelancer_id: freelancer_id || null,
      consultant_id: consultant_id || null,
      job_id,
      message,
      type,
      receiver_id,
      sender_id: senderId,
      admin_email,
      is_read: false,
      timestamp: new Date()
    };
    if (type !== 'new_query') {
      notificationPayload.receiver_id = receiver_id;
    }

    // For query notifications, we don't use receiver_id
    if (type === 'new_query') {
      notificationPayload.admin_email = admin_email;
    }
    // Save the notification
    const newNotification = new Notification(notificationPayload);
    const savedNotification = await newNotification.save();

    // Emit the notification to the recipient's room
    if (global.io) {
      if (type === 'new_query') {
        const adminRoom = `admin_${admin_email}`;
        console.log(`Emitting query notification to admin room:`, adminRoom);
        global.io.to(adminRoom).emit('notification', {
          ...savedNotification.toObject(),
          notificationType: 'new_query'
        });
      } else {
        const userRoom = `user_${receiver_id}`;
        console.log(`Emitting notification to user room:`, userRoom);
        global.io.to(userRoom).emit('notification', savedNotification);
      }
    }

    return savedNotification;
  } catch (error) {
    console.error('CRITICAL ERROR in createNotification:', error);
    throw error;
  }
};


// Helper function to determine the correct notification room
// Helper function to determine the correct notification room
function getNotificationRoom(type, senderId, clientId, freelancerId, consultantId) {
  const routingRules = {
    'hired': { targetId: freelancerId, role: 'freelancer', excludeId: senderId },
    'new_proposal': { targetId: clientId, role: 'client', excludeId: senderId },
    'new_offer': { targetId: freelancerId || consultantId, role: freelancerId ? 'freelancer' : 'consultant', excludeId: senderId },
    'milestone_completed': { targetId: clientId, role: 'client', excludeId: senderId },
    'payment_received': { targetId: freelancerId, role: 'freelancer', excludeId: senderId }
  };

  const rule = routingRules[type];
  if (!rule) return null;

  // Ensure the targetId is not the senderId
  if (rule.targetId && rule.targetId.toString() === rule.excludeId.toString()) {
    return null;
  }

  return `${rule.role}_${rule.targetId}`;
}

// Socket Server Setup
function setupSocketServer(io) {
  io.on('connection', (socket) => {
    const { userId, email, isAdmin } = socket.handshake.auth;
    console.log('Socket connection established with auth:', { userId, email, isAdmin });

    // Join user-specific room
    if (userId) {
      const userRoom = `user_${userId}`;
      socket.join(userRoom);
      console.log(`User ${userId} joined room ${userRoom}`);
    }

    // If user is admin, join admin-specific room
    if (isAdmin && email) {
      const adminRoom = `admin_${email}`;
      socket.join(adminRoom);
      console.log(`Admin joined room ${adminRoom}`);
    }

    // Handle explicit room joining
    socket.on('join-rooms', (data) => {
      if (data.userId) {
        const userRoom = `user_${data.userId}`;
        socket.join(userRoom);
        console.log(`User ${data.userId} explicitly joined room ${userRoom}`);
      }
      
      if (data.isAdmin && data.email) {
        const adminRoom = `admin_${data.email}`;
        socket.join(adminRoom);
        console.log(`Admin explicitly joined room ${adminRoom}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}


// Function to fetch notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const userEmail = req.user.email;
    let query = {};
    switch (userRole) {
      case 'admin':
        query = {
          $or: [
            { admin_email: userEmail },
            { type: 'new_query' }
          ]
        };
        break;
      case 'client':
        query.client_id = userId;
        break;
      case 'freelancer':
        query.freelancer_id = userId;
        break;
      case 'consultant':
        query.consultant_id = userId;
        break;
      default:
        return res.status(400).json({ message: 'Invalid user role' });
    }
    const notifications = await Notification.find(query)
      .sort({ timestamp: -1 })
      .populate({ path: 'client_id', select: 'first_name last_name' })
      .populate({ path: 'freelancer_id', select: 'first_name last_name' })
      .populate({ path: 'consultant_id', select: 'first_name last_name' });

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
    const userEmail = req.user.email;
    let query = { is_read: false };
    switch (userRole) {
      case 'admin':
        query = {
          is_read: false,
          $or: [
            { type: 'new_query', admin_email: userEmail },
            { type: 'new_query' }
          ]
        };
        break;
      case 'client':
        query.client_id = userId;
        break;
      case 'freelancer':
        query.freelancer_id = userId;
        break;
      case 'consultant':
        query.consultant_id = userId;
        break;
      default:
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
    const userRole = req.user.role;
    const notificationId = req.params.notificationId;
    const userEmail = req.user.email;
    let updateQuery;
    switch (userRole) {
      case 'admin':
        updateQuery = {
          _id: notificationId,
          $or: [
            { type: 'new_query', admin_email: userEmail },
            { type: 'new_query' }
          ]
        };
        break;
      case 'client':
        updateQuery.client_id = userId;
        break;
      case 'freelancer':
        updateQuery.freelancer_id = userId;
        break;
      case 'consultant':
        updateQuery.consultant_id = userId;
        break;
      default:
        return res.status(400).json({ message: 'Invalid user role' });
    }

    const notification = await Notification.findOneAndUpdate(
      updateQuery,
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

module.exports = {
  createNotification: exports.createNotification,
  getNotifications: exports.getNotifications,
  getUnreadNotificationsCount: exports.getUnreadNotificationsCount,
  updateNotification: exports.updateNotification,
  checkAuth: exports.checkAuth,
  setupSocketServer,  
};