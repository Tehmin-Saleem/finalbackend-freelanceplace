// const Notification = require('../models/notifications.model');

// // Function to create a notification
// exports.createNotification = async (notificationData) => {
//   try {
//     console.log('Creating notification with data:', notificationData);
//     const { 
//       client_id, 
//       freelancer_id, 
//       consultant_id, 
//       job_id, 
//       message, 
//       type, 
//       senderId  // Sender's ID
//     } = notificationData;

    
//     // Validate required fields based on notification type
//     if (!type || (!client_id && !freelancer_id && !consultant_id)) {
//       console.error('Missing required fields:', { client_id, freelancer_id, consultant_id, job_id, type });
//       throw new Error('Missing required fields');
//     }
//     let recipientId = null;
//     if (type === 'new_offer') {
//       recipientId = consultant_id || freelancer_id;
//     } else if (type === 'new_proposal') {
//       recipientId = client_id; 
//     } else if (['hired', 'milestone_completed', 'payment_received'].includes(type)) {
//       recipientId = freelancer_id;
//     }
//     console.log('Recipient ID:', recipientId);
//     console.log('Sender ID:', senderId);

//     // Block notifications if the recipient is the sender
//     if (recipientId && recipientId.toString() === senderId.toString()) {
//       console.warn('NOTIFICATION BLOCKED: Recipient is the same as the sender');
//       return null;
//     }

//     // Log detailed recipient and sender information
//     console.log('Recipient ID:', recipientId);
//     console.log('Sender ID:', senderId);
//     console.log('Are Recipient and Sender the same?', recipientId === senderId);

//     // Prevent notification if recipient is the sender
//     if (recipientId === senderId) {
//       console.warn('NOTIFICATION BLOCKED: Recipient is the sender');
//       return null;
//     }

//     const notificationPayload = {
//       client_id,
//       job_id,
//       freelancer_id: freelancer_id || null,
//       consultant_id: consultant_id || null,
//       message,
//       type,
//       sender_id: senderId,
//       is_read: false,
//       timestamp: new Date()
//     };
//     // switch (type) {
//     //   case 'new_offer':
//     //     // Check if offer is for freelancer or consultant
//     //     if (type === 'new_offer') {
//     //       if (freelancer_id) {
//     //         notificationPayload.freelancer_id = freelancer_id;
//     //       } else if (consultant_id) {
//     //         notificationPayload.consultant_id = consultant_id;
//     //       }
//     //     } else {
//     //       throw new Error('Invalid recipient for new_offer');
//     //     }
//     //     break;
//     //   case 'hired':
//     //     if (freelancer_id !== senderId) {
//     //       notificationPayload.freelancer_id = freelancer_id;
//     //     }
//     //     break;
//     //   case 'new_proposal':
//     //     if (freelancer_id !== senderId) {
//     //       notificationPayload.freelancer_id = freelancer_id;
//     //     }
//     //     break;
//     //   case 'milestone_completed':
//     //     if (freelancer_id !== senderId) {
//     //       notificationPayload.freelancer_id = freelancer_id;
//     //     }
//     //     break;
//     //   case 'payment_received':
//     //     if (freelancer_id !== senderId) {
//     //       notificationPayload.freelancer_id = freelancer_id;
//     //     }
//     //     break;
//     //   default:
//     //     throw new Error('Invalid notification type');
//     // }

//     const newNotification = new Notification(notificationPayload);
//     const savedNotification = await newNotification.save();
    
// //     if (global.io) {
// //       const targetRoom = getNotificationRoom(type, client_id, freelancer_id, consultant_id, senderId,);
      
// //       if (targetRoom) {
// //         console.log(`Emitting ${type} notification to room:`, targetRoom);
// //         global.io.to(targetRoom).emit('notification', savedNotification);
// //       }
// //     }
    
// //     return savedNotification;
// //   } catch (error) {
// //     console.error('Error creating notification:', error);
// //     throw error;
// //   }
// // };
// if (global.io) {
//   const targetRoom = `${
//     freelancer_id ? 'freelancer' : 
//     consultant_id ? 'consultant' : 
//     'client'
//   }_${recipientId}`;

//   console.log('Target Room:', targetRoom);
//   global.io.to(targetRoom).emit('notification', savedNotification);
//   console.log('Notification emitted to room');
// }

// return savedNotification;
// } catch (error) {
// console.error('CRITICAL ERROR in createNotification:', error);
// throw error;
// }
// };
// // Helper function to determine the correct notification room
// function getNotificationRoom(type, senderId, clientId, freelancerId, consultantId) {
//   const routingRules = {
//     'hired': {
//       targetId: freelancerId,
//       role: 'freelancer',
//       excludeId: senderId
//     },
//     'new_proposal': {
//       targetId: clientId,
//       role: 'client',
//       excludeId: senderId
//     },
//     'new_offer': {
//       targetId: freelancerId || consultantId,
//       role: freelancerId ? 'freelancer' : 'consultant',
//       excludeId: senderId
//     },
//     'milestone_completed': {
//       targetId: clientId,
//       role: 'client',
//       excludeId: senderId
//     },
//     'payment_received': {
//       targetId: freelancerId,
//       role: 'freelancer',
//       excludeId: senderId
//     }
//   };

//   const rule = routingRules[type];
//   if (!rule) return null;

//   return `${rule.role}_${rule.targetId}`;
// }

// // Updated socket server setup function
// function setupSocketServer(io) {
//   io.on('connection', (socket) => {
//     const { userId, role } = socket.handshake.auth;

//     socket.on('join-rooms', (data) => {
//       // Only join rooms that are not specifically excluded
//       if (data.userId !== data.excludeId) {
//         const room = `${data.role}_${data.userId}`;
//         socket.join(room);
//         console.log(`User ${data.userId} joined room ${room}`);
//       }
//     });
//   });
// }

// exports.getNotifications = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const userRole = req.user.role;
//     console.log('Fetching notifications for user:', userId, 'Role:', userRole);

//     let query = {};
//     switch (userRole) {
//       case 'client':
//         query.client_id = userId;
//         break;
//       case 'freelancer':
//         query.freelancer_id = userId;
//         break;
//       case 'consultant':
//         query.consultant_id = userId;
//         break;
//       default:
//         return res.status(400).json({ message: 'Invalid user role' });
//     }

//     const notifications = await Notification.find(query)
//       .sort({ timestamp: -1 })
//       .populate({
//         path: 'client_id',
//         select: 'first_name last_name'
//       })
//       .populate({
//         path: 'freelancer_id',
//         select: 'first_name last_name'
//       })
//       .populate({
//         path: 'consultant_id',
//         select: 'firstname lastname'
//       });

//     res.json(notifications);
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     res.status(500).json({ message: 'Error fetching notifications', error: error.toString() });
//   }
// };
const Notification = require('../models/notifications.model');

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
      receiverId,
      senderId // Sender's ID
    } = notificationData;

    // Validate required fields based on notification type
    if (!type || (!client_id && !freelancer_id && !consultant_id)) {
      console.error('Missing required fields:', { client_id, freelancer_id, consultant_id, job_id, type });
      throw new Error('Missing required fields');
    }

    // Determine the recipient based on notification type
    let recipientId = receiverId || null;
    if (!recipientId) {
      if (type === 'new_offer') {
        recipientId = consultant_id || freelancer_id;
      } else if (type === 'new_proposal') {
        recipientId = client_id;
      } else if (['hired', 'milestone_completed', 'payment_received'].includes(type)) {
        recipientId = freelancer_id;
      }
    }

    console.log('Recipient ID:', recipientId, 'Sender ID:', senderId);


    // Block notifications if the recipient is the sender
    if (recipientId && recipientId.toString() === senderId.toString()) {
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
      receiver_id: recipientId,
      sender_id: senderId,
      is_read: false,
      timestamp: new Date()
    };

    // Save the notification
    const newNotification = new Notification(notificationPayload);
    const savedNotification = await newNotification.save();

    // Emit the notification to the recipient's room
    if (global.io) {
      const targetRoom = `user_${recipientId}`; // Use user-specific room

      if (targetRoom) {
        console.log(`Emitting ${type} notification to room:`, targetRoom);
        global.io.to(targetRoom).emit('notification', savedNotification);
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


// Updated socket server setup function
// Socket Server Setup
function setupSocketServer(io) {
  io.on('connection', (socket) => {
    const { userId } = socket.handshake.auth;

    if (userId) {
      // Join a user-specific room
      const userRoom = `user_${userId}`;
      socket.join(userRoom);
      console.log(`User ${userId} joined room ${userRoom}`);
    }

    // Optional: Add specific room joining logic if needed
    socket.on('join-rooms', (data) => {
      if (data.userId) {
        const userRoom = `user_${data.userId}`;
        socket.join(userRoom);
        console.log(`User ${data.userId} explicitly joined room ${userRoom}`);
      }
    });
  });
}


// Function to fetch notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let query = {};
    switch (userRole) {
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

    let query = { is_read: false };
    switch (userRole) {
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

    let updateQuery;
    switch (userRole) {
      case 'client':
        updateQuery = { _id: notificationId, client_id: userId };
        break;
      case 'freelancer':
        updateQuery = { _id: notificationId, freelancer_id: userId };
        break;
      case 'consultant':
        updateQuery = { _id: notificationId, consultant_id: userId };
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