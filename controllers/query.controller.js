const User = require('../models/user.model');
const Query = require('../models/query.modal');
const Client_Profile = require('../models/client_profile.model');
const Freelancer_Profile = require('../models/freelancer_profile.model');
const { createNotification } = require('./notifications.controller');

exports.createQuery = async (req, res) => {
  const { queryType, name, email, message, userId } = req.body;

  try {
    // Save the query
    const newQuery = new Query({
      queryType,
      name,
      email,
      message,
      userId,
    });

    await newQuery.save();

    // Find the user who is sending the query
    const sender = await User.findById(userId);
    if (!sender) {
      throw new Error('Sender user not found');
    }

    // Determine the sender's role by checking their profile
    let senderRole = null;
    let senderProfile = null;

    senderProfile = await Client_Profile.findOne({ client_id: userId });
    if (senderProfile) {
      senderRole = 'client';
    } else {
      senderProfile = await Freelancer_Profile.findOne({ freelancer_id: userId });
      if (senderProfile) {
        senderRole = 'freelancer';
      }
    }

    if (!senderRole) {
      throw new Error('Sender role not found');
    }

    // For query notifications, we use admin email directly
    // This will be handled differently in the notifications controller
    const notificationData = {
      type: 'new_query',
      message: `${senderProfile.first_name} (${senderRole}) has sent you a query`,
      sender_id: userId,
      admin_email: 'tehmina.saleem31@gmail.com', // Using email for admin instead of receiver_id
      client_id: senderRole === 'client' ? userId : null,
      freelancer_id: senderRole === 'freelancer' ? userId : null,
      consultant_id: senderRole === 'consultant' ? userId : null, // Assuming there is no consultant role in this context
      job_id: null
    };

    await createNotification(notificationData);
    console.log("Notification sent to admin successfully");

    res.status(201).json({ message: 'Query submitted successfully!' });
  } catch (error) {
    console.error('Error in query submission:', error);
    res.status(500).json({
      message: 'Server error: Unable to submit query',
      error: error.message
    });
  }
};

  

// Handle getting all queries (optional, for admins or to show on the dashboard)
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find();
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Server error: Unable to fetch queries' });
  }
};





exports.getUser = async (req, res) => {
    const { name, email } = req.query;

    // If name and email are provided, search for a specific user
    if (name && email) {
        const user = await User.findOne({ where: { name, email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    }

    // If no name and email, return all users
    const users = await User.findAll(); // Adjust this query based on your requirements
    res.json(users);
};



exports.getQueryById = async (req, res) => {
    const { id } = req.params;
    try {
      const query = await Query.findById(id);
      if (!query) {
        return res.status(404).json({ message: 'Query not found' });
      }
      res.json(query);
    } catch (error) {
       return res.status(500).json({ message: 'Error fetching query', error });
    }
  };


  exports.updatequery= async (req, res) => {
    const queryId = req.params.id;
    const { status } = req.body;  // Get new status from the request body

    try {
        const updatedQuery = await Query.findByIdAndUpdate(
            queryId,
            { status },  // Update the status field
            { new: true }  // Return the updated document
        );

        if (!updatedQuery) {
            return res.status(404).json({ message: 'Query not found' });
        }

        res.json(updatedQuery);  // Return the updated query
    } catch (error) {
        console.error(error);
         return res.status(500).json({ message: 'Server error' });
    }
};
