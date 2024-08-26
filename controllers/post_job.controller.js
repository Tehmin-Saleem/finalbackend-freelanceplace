const Job_Post = require('../models/post_job.model');

exports.createJobPost = async (req, res) => {
  try {
    const {
      budget_type,
      hourly_rate_from,
      hourly_rate_to,
      fixed_price,
      description,
      job_title,
      project_duration,
      preferred_skills,
      status,
    } = req.body;
    
    let hourly_rate = null;
    if (budget_type === 'hourly') {
      hourly_rate = {
        from: hourly_rate_from || null,
        to: hourly_rate_to || null
      };
    }
    console.log('Received data:', { 
      budget_type, hourly_rate, fixed_price, description, job_title, 
      project_duration, preferred_skills, status 
    });

    let attachmentData = null;
    if (req.file) {
      attachmentData = {
        fileName: req.file.filename,
        path: req.file.path,
        description: req.body.attachmentDescription || ''
      };
    }
    const newJobPost = new Job_Post({
      client: req.user._id,
      attachment: attachmentData,
      budget_type,
      hourly_rate,
      fixed_price,
      description,
      job_title,
      project_duration,
      preferred_skills,
      status: status ,
      freelancer_id: null,
    });

    await newJobPost.save();
    res.status(201).json({ message: 'Job post created successfully', jobPost: newJobPost });
  } catch (err) {
    console.error('Error creating job post:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


exports.getClientJobPosts = async (req, res) => {
  try {
    // const client_id = req.user._id; 

    const jobPosts = await Job_Post.find();

    res.status(200).json({ jobPosts });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};  

// Backend API controller
exports.getJobPostById = async (req, res) => {
  try {
    const { jobPostId } = req.params; // Change from req.query to req.params
    const jobPost = await Job_Post.findById(jobPostId);

    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    res.status(200).json({ jobPost });
  } catch (err) {
    console.error('Error fetching job post:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.updateJobPost = async (req, res) => {
  try {
    const { jobPostId } = req.params;
    const client_id = req.user._id;
    const updateData = req.body;

    const updatedJobPost = await Job_Post.findOneAndUpdate(
      { _id: jobPostId, client_id },
      updateData,
      { new: true }
    );

    if (!updatedJobPost) {
      return res.status(404).json({ message: 'Job post not found or unauthorized' });
    }

    res.status(200).json({ message: 'Job post updated successfully', jobPost: updatedJobPost });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteJobPost = async (req, res) => {
  try {
    const { jobPostId } = req.params;
    const client_id = req.user._id;

    const deletedJobPost = await Job_Post.findOneAndDelete({ _id: jobPostId, client_id });

    if (!deletedJobPost) {
      return res.status(404).json({ message: 'Job post not found or unauthorized' });
    }

    res.status(200).json({ message: 'Job post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
