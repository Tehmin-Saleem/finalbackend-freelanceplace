const Notification = require('./models/Notification'); // Assuming you have a Notification model

exports.createNotification = async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    
    const newNotification = new Notification({
      title,
      description,
      userId,
      createdAt: new Date(),
    });
    
    await newNotification.save();

    // Emit the notification to the user
    io.to(userId.toString()).emit('notification', newNotification);

    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
