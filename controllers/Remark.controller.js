const mongoose = require('mongoose');
const Remark = require('../models/Remark.model');
const ProjectDetails= require('../models/SendProjectDetails.model');
const User = require('../models/user.model');
const ConsultantOffer = require('../models/hire_consultant.model'); // Adjust the path as needed
exports.addRemark = async (req, res) => {
    try {
        const { offerId, remark } = req.body;

        // Validate ObjectId for offerId
        if (!mongoose.Types.ObjectId.isValid(offerId)) {
            return res.status(400).json({ error: "Invalid offerId" });
        }

        // Fetch project details based on offerId
        const projectDetails = await ProjectDetails.findOne({ offerId });

        if (!projectDetails) {
            return res.status(404).json({ error: "Offer not found" });
        }

        const { clientId, consultantId } = projectDetails; // Retrieve clientId and consultantId from project details

        // Fetch client details to get the email
        const client = await User.findById(clientId);

        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        const clientEmail = client.email; // Retrieve the email address of the client

        // Create a new Remark
        const newRemark = new Remark({
            clientId,
            consultantId,
            offerId,
            remark,
        });

        // Save the remark
        await newRemark.save();

        res.status(201).json({
            message: "Remark added successfully",
            remark: newRemark,
            clientEmail, // Include the client's email in the response
        });
    } catch (error) {
        console.error("Error in addRemark controller:", error.message);
        return res.status(500).json({ error: "Failed to add remark" });
    }
};

  

  


// Get all remarks for a specific offer
exports.getRemarks = async (req, res) => {
    const { offerId, consultantId } = req.params;
  
    try {
      const remarks = await Remark.find({ offerId, consultantId }).sort({ createdAt: -1 });
      res.status(200).json(remarks);

    } catch (error) {
      console.error('Error fetching remarks:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };

  exports.getRemarksByProjectAndClient = async (req, res) => {
    const { job_title, clientId } = req.params; // Extract parameters from the request
    console.log("Frontend parameters:", job_title, clientId);

    try {
        // Step 1: Fetch all offerIds from ProjectDetails for the given clientId
        const projectDetailsList = await ProjectDetails.find({ clientId });

        if (!projectDetailsList || projectDetailsList.length === 0) {
            console.log("No project details found for the client.");
            return res.status(404).json({ error: "No project details found for this client." });
        }

        // Step 2: Iterate through the project details to validate each offerId
        let remarksList = [];
        for (const project of projectDetailsList) {
            const { offerId } = project;
            console.log("Checking offerId:", offerId);

            // Step 3: Fetch the ConsultantOffer for the current offerId
            const consultantOffer = await ConsultantOffer.findOne({ _id: offerId });

            if (!consultantOffer) {
                console.log("No ConsultantOffer found for offerId:", offerId);
                continue;
            }

            // Step 4: Debugging the project and offer matching
            console.log("Checking project_name and client_id match...");
            console.log("Offer project_name:", consultantOffer.project_name);
            console.log("Frontend job_title:", job_title);
            console.log("Offer client_id:", consultantOffer.client_id.toString());
            console.log("Frontend clientId:", clientId);

            // Step 5: Match project_name and client_id to fetch remarks
            if (
                consultantOffer.project_name === job_title &&
                consultantOffer.client_id.toString() === clientId
            ) {
                console.log("Project and client matched, fetching remarks...");
                console.log("offerId passed to the Projectdatils",offerId);

                const offerIdObject = new mongoose.Types.ObjectId(offerId);
                 const remarks = await Remark.find({ offerId: offerIdObject }).select("remark createdAt");


                // Step 6: Fetch all remarks for this offerId from ProjectDetails
                // const remarks = await ProjectDetails.find({ offerId }).select("remark createdAt");

                // Debugging the fetched remarks
                console.log("Fetched remarks from ProjectDetails:", remarks);

                if (remarks && remarks.length > 0) {
                    remarksList = [...remarksList, ...remarks]; // Collect all remarks
                } else {
                    console.log("No remarks found for this offerId:", offerId);
                }
            } else {
                console.log("Project and client did not match for this offerId:", offerId);
            }
        }

        // Step 7: Return the remarks or a message if none are found
        if (remarksList.length === 0) {
            return res.status(404).json({ message: "No remarks available for this project." });
        }

        console.log("Remarks fetched:", remarksList);
        return res.status(200).json(remarksList);
    } catch (error) {
        console.error("Error fetching remarks:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


