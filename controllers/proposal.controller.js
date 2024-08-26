const Proposal = require('../models/proposal.model');

exports.createProposal = async (req, res) => {
    try {
        const { add_requirements, attachment, cover_letter, job_id, project_duration, portfolio_link } = req.body;
        const freelancer_id = req.user._id; 
        

        const newProposal = new Proposal({
            add_requirements,
            attachment,
            
            cover_letter,
            freelancer_id,
            job_id,
            project_duration,
            portfolio_link,
        });

        await newProposal.save();
        res.status(201).json({ message: 'Proposal created successfully', proposal: newProposal });
    } catch (err) {
        console.error('Error creating proposal:', err); 
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};



exports.getFreelancerProposals = async (req, res) => {
  try {
    

     const proposals = await Proposal.find();

    res.status(200).json({ proposals });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getProposalById = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const freelancer_id = req.user._id;

    const proposal = await Proposal.findOne({ _id: proposalId, freelancer_id }).populate('client_id job_id');

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found or unauthorized' });
    }

    res.status(200).json({ proposal });
} catch (err) {
    console.error('Error getting proposal:', err); 
    res.status(500).json({ message: 'Internal server error', error: err.message });
}
};


exports.updateProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const freelancer_id = req.user._id;
    const updateData = req.body;

    const updatedProposal = await Proposal.findOneAndUpdate(
      { _id: proposalId, freelancer_id },
      updateData,
      { new: true }
    );

    if (!updatedProposal) {
      return res.status(404).json({ message: 'Proposal not found or unauthorized' });
    }

    res.status(200).json({ message: 'Proposal updated successfully', proposal: updatedProposal });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const freelancer_id = req.user._id;

    const deletedProposal = await Proposal.findOneAndDelete({ _id: proposalId, freelancer_id });

    if (!deletedProposal) {
      return res.status(404).json({ message: 'Proposal not found or unauthorized' });
    }

    res.status(200).json({ message: 'Proposal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
