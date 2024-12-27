const Offer_Form = require("../models/offer_form.model");
const Notification = require("../controllers/notifications.controller");
const mongoose = require("mongoose");
const jobpost = require("../models/post_job.model");
const review = require("../models/review.model");
const NotificationModel = require("../models/notifications.model");

exports.createoffer = async (req, res) => {
  console.log("Offer Controller: createoffer hit");
  console.log("Request body:", req.body);
  console.log("Attached file:", req.file);

  try {
    const {
      budget_type,
      hourly_rate_from,
      hourly_rate_to,
      fixed_price,
      description,
      detailed_description,
      freelancer_id,
      job_title,
      preferred_skills,
      due_date,
      estimated_timeline_duration, // New field
      estimated_timeline_unit,
    } = req.body;
    if (!due_date) {
      return res.status(400).json({ message: "Due date is required" });
    }
    if (!estimated_timeline_duration || !estimated_timeline_unit) {
      return res.status(400).json({
        message: "Both duration and unit are required for estimated timeline",
      });
    }
    console.log("Budget type:", budget_type);
    console.log("Hourly rates (raw):", {
      from: hourly_rate_from,
      to: hourly_rate_to,
    });
    console.log("Fixed price (raw):", fixed_price);
    const duration = parseFloat(estimated_timeline_duration);
    if (isNaN(duration) || duration <= 0) {
      return res.status(400).json({
        message: "Timeline duration must be a positive number",
      });
    }
    let budget = {
      budget_type: budget_type,
    };

    if (budget_type === "hourly") {
      // Convert and validate hourly rates
      const from = hourly_rate_from ? parseFloat(hourly_rate_from) : null;
      const to = hourly_rate_to ? parseFloat(hourly_rate_to) : null;

      console.log("Parsed hourly rates:", { from, to });

      if (from === null || to === null) {
        console.log("Hourly rate validation failed");
        return res
          .status(400)
          .json({
            message: "Hourly rate values are required for hourly budget type",
          });
      }

      if (from > to) {
        console.log("Invalid rate range: minimum exceeds maximum");
        return res
          .status(400)
          .json({ message: "Minimum hourly rate cannot exceed maximum rate" });
      }

      budget.hourly_rate = {
        from: from,
        to: to,
      };
    } else if (budget_type === "fixed") {
      // Convert and validate fixed price
      const price = fixed_price ? parseFloat(fixed_price) : null;
      console.log("Parsed fixed price:", price);

      if (price === null) {
        console.log("Fixed price validation failed");
        return res
          .status(400)
          .json({ message: "Fixed price is required for fixed budget type" });
      }

      budget.fixed_price = price;
    }

    const client_id = req.user.userId || req.user.id;
    if (!client_id) {
      return res
        .status(400)
        .json({ message: "Client ID not found in the request" });
    }

    let attachment = null;
    if (req.file) {
      if (req.file.size > 5 * 1024 * 1024) {
        return res
          .status(400)
          .json({ message: "File size exceeds limit (5MB)" });
      }
      attachment = {
        fileName: req.file.originalname,
        path: req.file.path,
        description: req.body.attachmentDescription,
      };
    }

    // Create the new offer first
    const newOffer = new Offer_Form({
      attachment,
      ...budget,
      due_date: new Date(due_date),
      estimated_timeline: {
        duration: duration,
        unit: estimated_timeline_unit,
      },
      client_id,
      description,
      detailed_description,
      freelancer_id,
      job_title,
      preferred_skills: preferred_skills ? JSON.parse(preferred_skills) : [],
      status: "pending", // Initial status
    });

    console.log("New Offer to be saved:", newOffer);

    const savedOffer = await newOffer.save();
    console.log("Saved offer:", savedOffer);

    // Create a notification using the correct offer ID (_id from saved offer)
    const notificationData = {
      client_id: client_id,
      freelancer_id: freelancer_id,
      job_id: savedOffer._id, // This is the correct offer ID
      type: "new_offer",
      senderId: client_id,
      receiver_id: freelancer_id,
      message: `You have received a new offer for "${job_title}"`,
    };

    console.log(
      "Creating new offer notification with correct offer ID:",
      notificationData
    );
    await Notification.createNotification(notificationData);

    // Return the saved offer with its ID
    res.status(201).json({
      ...savedOffer.toObject(),
      offerId: savedOffer._id, // Include the offer ID explicitly in the response
    });
  } catch (error) {
    console.error("Error creating offer:", error);
    res
      .status(500)
      .json({ message: "Error creating offer", error: error.message });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status } = req.body;
    console.log("Getting offer details - notificationId:", notificationId);

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ message: "Invalid Offer ID format" });
    }

    let offer = await Offer_Form.findById(notificationId).populate(
      "client_id",
      "first_name last_name country_name"
    );
    console.log("Found offer in database:", offer);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // If status is provided in query params, update the offer status
    if (status && ["accepted", "declined"].includes(status)) {
      console.log("Updating offer status to:", status);
      offer.status = status;
      await offer.save();
      console.log("Offer status updated in database");

      const notificationMessage =
        status === "accepted"
          ? `Your offer for "${offer.job_title}" has been accepted`
          : `Your offer for "${offer.job_title}" has been declined`;

      const notificationData = {
        client_id: offer.client_id._id,
        freelancer_id: offer.freelancer_id,
        job_id: notificationId,
        type: `offer_${status}`,
        message: notificationMessage,
      };

      console.log("Creating notification with data:", notificationData);
      await Notification.createNotification(notificationData);
    }

    // Get client's reviews
    const clientReviews = await review.aggregate([
      {
        $match: {
          client_id: offer.client_id._id,
          status: "Completed",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "freelancer_id",
          foreignField: "_id",
          as: "reviewer",
        },
      },
      {
        $unwind: "$reviewer",
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$stars" },
          totalReviews: { $sum: 1 },
          reviews: {
            $push: {
              stars: "$stars",
              message: "$message",
              reviewerName: {
                $concat: ["$reviewer.first_name", " ", "$reviewer.last_name"],
              },
            },
          },
        },
      },
    ]);

    // Get client's completed jobs count
    const completedJobsCount = await jobpost.countDocuments({
      client_id: offer.client_id._id,
      jobstatus: "completed",
    });

    let budgetDetails;
    if (offer.budget_type === "hourly" && offer.hourly_rate) {
      budgetDetails = {
        budget_type: "hourly",
        hourly_rate: {
          from: offer.hourly_rate.from,
          to: offer.hourly_rate.to,
        },
      };
    } else if (offer.budget_type === "fixed" && offer.fixed_price) {
      budgetDetails = {
        budget_type: "fixed",
        fixed_price: offer.fixed_price,
      };
    } else {
      budgetDetails = {
        budget_type: "unknown",
        message: "Budget details are not available",
      };
    }

    const clientStats = clientReviews[0] || {
      averageRating: 0,
      totalReviews: 0,
      reviews: [],
    };

    const formattedOffer = {
      _id: offer._id,
      status: offer.status,
      clientFirstName: offer.client_id.first_name,
      clientLastName: offer.client_id.last_name,
      clientCountry: offer.client_id.country_name,
      clientStats: {
        rating: parseFloat(clientStats.averageRating.toFixed(1)),
        totalReviews: clientStats.totalReviews,
        completedJobs: completedJobsCount,
        recentReviews: clientStats.reviews.slice(0, 5), // Get last 5 reviews
      },
      due_date: offer.due_date,
      estimated_timeline: {
        duration: offer.estimated_timeline.duration,
        unit: offer.estimated_timeline.unit,
      },
      location: offer.location,
      job_title: offer.job_title,
      ...budgetDetails,
      description: offer.description,
      detailed_description: offer.detailed_description,
      preferred_skills: offer.preferred_skills,
      attachment: offer.attachment
        ? {
            fileName: offer.attachment.fileName,
            path: offer.attachment.path,
          }
        : null,
    };

    console.log("Sending formatted offer:", formattedOffer);
    res.status(200).json(formattedOffer);
  } catch (error) {
    console.error("Error in getOfferById:", error);
    res.status(500).json({
      message: "Error fetching offer details",
      error: error.message,
    });
  }
};
exports.getOffers = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    console.log("Logged-in user ID:", loggedInUserId);

    if (!loggedInUserId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    // Find all offers for the logged-in freelancer
    const offers = await Offer_Form.find({
      freelancer_id: loggedInUserId,
      status: "accepted", // Only get accepted offers
    }).populate("client_id", "first_name last_name country_name");

    console.log("Raw offers data:", offers);

    if (!offers || offers.length === 0) {
      return res.status(200).json({
        message: "No accepted offers found",
        offers: [],
      });
    }

    // Format the offers to match frontend expectations
    const formattedOffers = offers.map((offer) => ({
      _id: offer._id,
      type:
        offer.budget_type === "fixed"
          ? "Fixed"
          : offer.budget_type === "hourly"
            ? "Hourly"
            : "Unknown",
      title: offer.job_title || "Untitled Job",
      client_id: offer.client_id?._id || null,
      freelancer_id: offer.freelancer_id,
      rate:
        offer.budget_type === "fixed"
          ? `$${offer.fixed_price}`
          : offer.budget_type === "hourly" && offer.hourly_rate
            ? `$${offer.hourly_rate.from}-$${offer.hourly_rate.to}/hr`
            : "Rate not available",
      description: offer.description || "No description provided",
      detailed_description:
        offer.detailed_description || "No detailed description provided",
      tags: offer.preferred_skills || [],
      location: offer.location || "Not specified",
      postedTime: new Date(offer.createdAt).toLocaleDateString(),
      status: "accepted",
      due_date: offer.due_date
        ? new Date(offer.due_date).toLocaleDateString()
        : "Not specified",
      estimated_timeline: offer.estimated_timeline
        ? {
            duration: offer.estimated_timeline.duration,
            unit: offer.estimated_timeline.unit,
          }
        : {
            duration: 0,
            unit: "Not specified",
          },
      clientName: offer.client_id
        ? `${offer.client_id.first_name} ${offer.client_id.last_name}`
        : "Unknown Client",
      clientCountry: offer.client_id?.country_name || "Not specified",
      attachment: offer.attachment
        ? {
            fileName: offer.attachment.fileName,
            path: offer.attachment.path,
            description: offer.attachment.description,
          }
        : null,
    }));

    console.log("Formatted offers:", formattedOffers);

    res.status(200).json({
      message: "Offers retrieved successfully",
      offers: formattedOffers,
    });
  } catch (error) {
    console.error("Error in getOffers:", error);
    res.status(500).json({
      message: "Error fetching offer details",
      error: error.message,
    });
  }
};

exports.updateOfferStatus = async (req, res) => {
  try {
    const { notificationId } = req.params; // Changed from offerId to notificationId
    const { status } = req.body;
    console.log(
      "Updating offer status - ID:",
      notificationId,
      "Status:",
      status
    );

    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const offer = await Offer_Form.findById(notificationId);
    console.log("Found offer for status update:", offer);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Update status
    offer.status = status;
    const updatedOffer = await offer.save();
    console.log("Offer status updated to:", updatedOffer.status);

    // Create notification for the client
    const notificationMessage =
      status === "accepted"
        ? `Your offer for "${offer.job_title}" has been accepted`
        : `Your offer for "${offer.job_title}" has been declined`;

    const notificationData = {
      client_id: offer.client_id,
      freelancer_id: offer.freelancer_id,
      job_id: offer._id,
      type: `offer_${status}`,
      message: notificationMessage,
    };

    console.log("Creating notification:", notificationData);
    await Notification.createNotification(notificationData);

    res.status(200).json({
      message: `Offer ${status} successfully`,
      offer: updatedOffer,
    });
  } catch (error) {
    console.error("Error updating offer status:", error);
    res
      .status(500)
      .json({ message: "Error updating offer status", error: error.message });
  }
};
exports.getOffersByFreelancerId = async (req, res) => {
  console.log("getOffersByFreelancerId called with params:", req.params);

  try {
    const { freelancerId } = req.params;

    if (!freelancerId) {
      return res.status(400).json({ message: "Freelancer ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(freelancerId)) {
      return res.status(400).json({ message: "Invalid Freelancer ID format" });
    }

    // First, get the offers with proper sorting
    const offers = await Offer_Form.find({ freelancer_id: freelancerId })
      .sort({ createdAt: -1 }) // This ensures newest first in MongoDB
      .populate("client_id", "first_name last_name country_name");

    if (offers.length === 0) {
      return res
        .status(404)
        .json({ message: "No offers found for this freelancer" });
    }

    // Process each offer to include detailed information
    const formattedOffers = await Promise.all(
      offers.map(async (offer) => {
        const clientReviews = await review.aggregate([
          {
            $match: {
              client_id: offer.client_id._id,
              status: "Completed",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "freelancer_id",
              foreignField: "_id",
              as: "reviewer",
            },
          },
          {
            $unwind: "$reviewer",
          },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$stars" },
              totalReviews: { $sum: 1 },
              reviews: {
                $push: {
                  stars: "$stars",
                  message: "$message",
                  reviewerName: {
                    $concat: [
                      "$reviewer.first_name",
                      " ",
                      "$reviewer.last_name",
                    ],
                  },
                },
              },
            },
          },
        ]);

        const completedJobsCount = await jobpost.countDocuments({
          client_id: offer.client_id._id,
          jobstatus: "completed",
        });

        let budgetDetails;
        if (offer.budget_type === "hourly" && offer.hourly_rate) {
          budgetDetails = {
            budget_type: "hourly",
            hourly_rate: {
              from: offer.hourly_rate.from,
              to: offer.hourly_rate.to,
            },
          };
        } else if (offer.budget_type === "fixed" && offer.fixed_price) {
          budgetDetails = {
            budget_type: "fixed",
            fixed_price: offer.fixed_price,
          };
        } else {
          budgetDetails = {
            budget_type: "unknown",
            message: "Budget details are not available",
          };
        }

        const clientStats = clientReviews[0] || {
          averageRating: 0,
          totalReviews: 0,
          reviews: [],
        };

        // Format the offer with the createdAt date
        return {
          _id: offer._id,
          createdAt: offer.createdAt, // Ensure createdAt is included
          status: offer.status,
          clientFirstName: offer.client_id.first_name,
          clientLastName: offer.client_id.last_name,
          clientCountry: offer.client_id.country_name,
          clientStats: {
            rating: parseFloat(clientStats.averageRating.toFixed(1)),
            totalReviews: clientStats.totalReviews,
            completedJobs: completedJobsCount,
            recentReviews: clientStats.reviews.slice(0, 5),
          },
          location: offer.location,
          job_title: offer.job_title,
          ...budgetDetails,
          description: offer.description,
          detailed_description: offer.detailed_description,
          preferred_skills: offer.preferred_skills,
          attachment: offer.attachment
            ? {
                fileName: offer.attachment.fileName,
                path: offer.attachment.path,
              }
            : null,
        };
      })
    );

    // Log the sorted offers for debugging
    console.log(
      "Sending formatted offers:",
      formattedOffers.map((o) => ({
        title: o.job_title,
        date: o.createdAt,
      }))
    );

    res.status(200).json(formattedOffers);
  } catch (error) {
    console.error("Error fetching offers for freelancer:", error);
    res.status(500).json({
      message: "Error fetching offers for freelancer",
      error: error.message,
    });
  }
};
