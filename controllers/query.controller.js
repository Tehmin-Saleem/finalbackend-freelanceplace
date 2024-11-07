const User = require('../models/user.model'); // Import your User model
// controllers/query.controller.js
const Query = require('../models/query.modal');

// Handle creating a new query
exports.createQuery = async (req, res) => {
    const { queryType, name, email, message,userId } = req.body;
  
    console.log("Received queryType:", queryType);
    console.log("Received name:", name);
    console.log("Received email:", email);
    console.log("Received message:", message);
  
    try {
      const newQuery = new Query({
        queryType,
        name,
        email,
        message,
        userId,
      });
  
      await newQuery.save();
      console.log("Query saved successfully");
      res.status(201).json({ message: 'Query submitted successfully!' });
    } catch (error) {
      console.error('Error saving query:', error);
      res.status(500).json({ message: 'Server error: Unable to submit query' });
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
