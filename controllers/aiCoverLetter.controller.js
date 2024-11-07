const axios = require('axios');
const Job_Post = require('../models/post_job.model'); // Import the Job_Post model
const Proposal = require('../models/proposal.model'); // Import the Proposal model
const Freelancer_Profile = require('../models/freelancer_profile.model'); // Import the Freelancer_Profile model






const generateCoverLetter = async (req, res) => {
    try {
      const {  additionalSkills, jobPostId, freelancerId } = req.body;

      console.log("freelancerId in backend" , freelancerId)
      console.log("jobid in backend", jobPostId)
      
  
      // Fetch the proposal and freelancer details
      // const proposals = await Proposal.findOne({ job_id: jobPostId }).populate('freelancer_id');
      // if (!proposals) {
      //   return res.status(404).json({ message: 'Proposal not found here' });
      // }
      
      
  
      // Fetch job details
      const job = await Job_Post.findById(jobPostId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }


      
      
      // Fetch freelancer profile
      const freelancerProfile = await Freelancer_Profile.findOne({ freelancer_id: freelancerId }).populate('freelancer_id', 'first_name last_name email');
      if (!freelancerProfile) {
        return res.status(404).json({ message: 'Freelancer profile not found' });
      }
      
      console.log("frelancerid in freelanceProfile" ,freelancerId )
      // Extract freelancer information
      const freelancerName = `${freelancerProfile.first_name} ${freelancerProfile.last_name}`;
      const freelancerExperience = freelancerProfile.experience.completed_projects || 0;
      const date = new Date().toLocaleDateString();
      const jobSkills = job.preferred_skills;
      const combinedSkills = jobSkills.concat(additionalSkills || []);
  
      // Prompt for the AI
      const prompt = `Write a cover letter for a freelancer named ${freelancerName}, applying for the job titled "${job.job_title}" on the project "Freelance MarketPlace". The freelancer has ${freelancerExperience} years of experience. The required skills are: ${combinedSkills.join(", ")}. Use good English words and create an outstanding cover letter.`;
  
      // Call the Gemini API for generating the cover letter
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      const generatedCoverLetter = response.data.candidates[0]?.content?.parts[0]?.text || "No content generated.";
  
      // Format the response similarly to the profile formatting
      const formattedCoverLetter = {
        freelancer_id: freelancerProfile.freelancer_id,
        freelancer_name: freelancerName || 'No Name',
        experience_years: freelancerExperience,
        job_title: job.job_title || '',
        skills: combinedSkills || [],
        generated_cover_letter: generatedCoverLetter,
        date_created: date,
      };
      console.log(formattedCoverLetter);
  

  
      // Return the formatted response
      res.status(200).json({ success: true, data: formattedCoverLetter });
    } catch (error) {
      console.error('Error generating cover letter:', error);
      res.status(500).json({ success: false, message: 'Error generating cover letter' });
    }
  };



  // In your backend controller
const saveCoverLetter = async (req, res) => {
  try {
    const { freelancerId, jobPostId, coverLetter } = req.body;

    console.log("coverletter in save cover letter" ,coverLetter)

    await Proposal.findOneAndUpdate(
      { freelancer_id: freelancerId, job_id: jobPostId },
      { cover_letter: coverLetter },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "Cover letter saved successfully." });
  } catch (error) {
    console.error("Error saving cover letter:", error);
    res.status(500).json({ success: false, message: "Error saving cover letter." });
  }
};


const getCoverLetter = async (req, res) => {
  try {
      const { freelancerId, jobPostId } = req.params;

      // Retrieve the cover letter from the Proposal document
      const proposal = await Proposal.findOne({ freelancer_id: freelancerId, job_id: jobPostId });

      if (!proposal || !proposal.cover_letter) {
          return res.status(404).json({ message: 'Cover letter not found' });
      }

      res.status(200).json({ success: true, cover_letter: proposal.cover_letter });
  } catch (error) {
      console.error('Error retrieving cover letter:', error);
      res.status(500).json({ success: false, message: 'Error retrieving cover letter' });
  }
};




  
module.exports = {
    generateCoverLetter,
    saveCoverLetter ,
    getCoverLetter,
  };
  
