const Payment_Method = require("../models/payment_method.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const paypalClient = require("../config/paypal.config");
const paypal = require("@paypal/checkout-server-sdk");
const Project = require("../models/manageProject.model");
const mongoose = require("mongoose");

exports.createPaymentMethod = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { type, paymentMethodId, email, userId, card } = req.body;

    let paymentMethod;

    // Check if a payment method already exists for this user
    const existingPaymentMethod = await Payment_Method.findOne({
      client_id: userId,
    });

    if (type === "credit") {
      console.log("Processing credit card payment method");

      // Retrieve the payment method from Stripe to get additional details
      const stripePaymentMethod =
        await stripe.paymentMethods.retrieve(paymentMethodId);

      paymentMethod = {
        billing_method: "Credit/Debit card",
        client_id: userId,
        card_details: {
          stripe_payment_method_id: paymentMethodId,
          last4: card.last4,
          brand: card.brand,
          exp_month: card.exp_month,
          exp_year: card.exp_year,
        },
      };
    } else if (type === "paypal") {
      console.log("Processing PayPal payment method");
      paymentMethod = {
        billing_method: "Paypal",
        client_id: userId,
        paypal_details: {
          email: email,
        },
      };
    } else {
      console.log("Invalid payment method type:", type);
      return res.status(400).json({ message: "Invalid payment method type" });
    }

    let result;
    if (existingPaymentMethod) {
      console.log("Updating existing payment method for user:", userId);
      result = await Payment_Method.findOneAndUpdate(
        { client_id: userId },
        paymentMethod,
        { new: true, runValidators: true }
      );
      console.log("Payment method updated successfully");
    } else {
      console.log("Creating new payment method for user:", userId);
      result = await Payment_Method.create(paymentMethod);
      console.log("New payment method created successfully");
    }

    res.status(200).json({
      message: existingPaymentMethod
        ? "Payment method updated successfully"
        : "Payment method created successfully",
      paymentMethod: result,
      nextStep: "/api/client/process-payment",
    });
  } catch (err) {
    console.error("Error in createPaymentMethod:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
// New function for processing payments
exports.processPayment = async (req, res) => {
  try {
    const { paymentMethodId, amount, currency = "usd" } = req.body;
    const { userId } = req.user; // Assuming you have middleware to extract user info from token

    // Retrieve the payment method
    const paymentMethod = await Payment_Method.findOne({
      client_id: userId,
      "card_details.stripe_payment_method_id": paymentMethodId,
    });

    if (!paymentMethod) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    let paymentIntent;

    if (paymentMethod.billing_method === "Credit/Debit card") {
      // Process credit card payment
      paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in cents
        currency: currency,
        payment_method: paymentMethodId,
        confirm: true,
      });
    } else if (paymentMethod.billing_method === "Paypal") {
      // For PayPal, you would typically redirect the user to PayPal's checkout
      // This is a placeholder for PayPal integration
      return res.status(200).json({
        message: "Redirect to PayPal",
        redirectUrl: `https://www.paypal.com/checkoutnow?token=${paymentMethodId}`,
      });
    }

    res.status(200).json({
      message: "Payment processed successfully",
      paymentIntent: paymentIntent,
    });
  } catch (err) {
    console.error("Error processing payment:", err);
    res
      .status(500)
      .json({ message: "Error processing payment", error: err.message });
  }
};
exports.getClientPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await Payment_Method.find();

    if (paymentMethods.length === 0) {
      return res
        .status(200)
        .json({ message: "No payment methods found", paymentMethods: [] });
    }

    const formattedPaymentMethods = paymentMethods.reduce((acc, method) => {
      acc[method.client_id.toString()] = {
        _id: method._id,
        client_id: method.client_id,
        billing_method: method.billing_method,
        card_details: method.card_details,
        paypal_details: method.paypal_details,
      };
      return acc;
    }, {});

    res.status(200).json({ paymentMethods: formattedPaymentMethods });
  } catch (err) {
    console.error("Error fetching payment methods:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
// exports.getClientPaymentMethods = async (req, res) => {
//   try {
//     const client_id = req.user._id;

//     const paymentMethods = await Payment_Method.find({ client_id }).populate('freelancer_id');

//     res.status(200).json({ paymentMethods });
//   } catch (err) {
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };

exports.getPaymentMethodById = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const client_id = req.user._id;

    const paymentMethod = await Payment_Method.findOne({
      _id: paymentMethodId,
      client_id,
    }).populate("freelancer_id");

    if (!paymentMethod) {
      return res
        .status(404)
        .json({ message: "Payment method not found or unauthorized" });
    }

    res.status(200).json({ paymentMethod });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.updatePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const client_id = req.user._id;
    const updateData = req.body;

    const updatedPaymentMethod = await Payment_Method.findOneAndUpdate(
      { _id: paymentMethodId, client_id },
      updateData,
      { new: true }
    );

    if (!updatedPaymentMethod) {
      return res
        .status(404)
        .json({ message: "Payment method not found or unauthorized" });
    }

    res.status(200).json({
      message: "Payment method updated successfully",
      paymentMethod: updatedPaymentMethod,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deletePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const client_id = req.user._id;

    const deletedPaymentMethod = await Payment_Method.findOneAndDelete({
      _id: paymentMethodId,
      client_id,
    });

    if (!deletedPaymentMethod) {
      return res
        .status(404)
        .json({ message: "Payment method not found or unauthorized" });
    }

    res.status(200).json({ message: "Payment method deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// ====================================

// Add these new functions to your existing controller

// Create PayPal Order
exports.createPayPalOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
    });

    const order = await paypalClient.execute(request);
    res.json({ orderId: order.result.id });
  } catch (error) {
    console.error("PayPal order creation error:", error);
    res
      .status(500)
      .json({ message: "Error creating PayPal order", error: error.message });
  }
};

// Capture PayPal Payment
exports.capturePayPalPayment = async (req, res) => {
  try {
    const { orderID } = req.body;
    const { userId } = req.user;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    const capture = await paypalClient.execute(request);

    // Update or create payment method record
    const paymentMethodData = {
      billing_method: "Paypal",
      client_id: userId,
      paypal_details: {
        email: capture.result.payer.email_address,
      },
    };

    await Payment_Method.findOneAndUpdate(
      { client_id: userId, billing_method: "Paypal" },
      paymentMethodData,
      { upsert: true, new: true }
    );

    res.json({
      message: "Payment captured successfully",
      captureId: capture.result.id,
    });
  } catch (error) {
    console.error("PayPal capture error:", error);
    res.status(500).json({
      message: "Error capturing PayPal payment",
      error: error.message,
    });
  }
};

// Update your existing processPayment function
exports.processPayment = async (req, res) => {
  try {
    const { paymentMethodId, amount, currency = "usd", paymentType } = req.body;
    const { userId } = req.user;

    if (paymentType === "paypal") {
      // Handle PayPal payment
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
      });

      const order = await paypalClient.execute(request);
      return res.json({
        paymentType: "paypal",
        orderId: order.result.id,
      });
    } else {
      // Existing Stripe payment logic
      const paymentMethod = await Payment_Method.findOne({
        client_id: userId,
        "card_details.stripe_payment_method_id": paymentMethodId,
      });

      if (!paymentMethod) {
        return res.status(404).json({ message: "Payment method not found" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: currency,
        payment_method: paymentMethodId,
        confirm: true,
      });

      res.json({
        paymentType: "stripe",
        paymentIntent: paymentIntent,
      });
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    res
      .status(500)
      .json({ message: "Error processing payment", error: error.message });
  }
};

exports.getFreelancerPaymentDetails = async (req, res) => {
  try {
    const { freelancerId } = req.params; // Find the payment method for the freelancer

    const paymentMethod = await Payment_Method.findOne({
      client_id: freelancerId,
    });

    if (!paymentMethod) {
      return res
        .status(404)
        .json({ message: "No payment method found for this freelancer" });
    }

    res.status(200).json({
      success: true,
      paymentMethod: {
        billing_method: paymentMethod.billing_method,
        paypal_details: paymentMethod.paypal_details,
        card_details: paymentMethod.card_details,
      },
    });
  } catch (err) {
    console.error("Error fetching freelancer payment details:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// exports.processPaymentForFreelancer = async (req, res) => {
//   try {
//     const { freelancerId, jobId, milestoneId, amount, paymentMethod,projectId, client_id, proposal_id  } = req.body; // Fetch the freelancer's payment method

//     const freelancerPaymentMethod = await Payment_Method.findOne({
//       client_id: freelancerId,
//     });

//     if (!freelancerPaymentMethod) {
//       return res
//         .status(404)
//         .json({ message: "Freelancer payment method not found" });
//     }

//     let paymentResult;

//     if (
//       freelancerPaymentMethod.billing_method === "Paypal" &&
//       paymentMethod === "paypal"
//     ) {
//       // PayPal payment logic
//       const request = new paypal.orders.OrdersCreateRequest();
//       request.prefer("return=representation");
//       request.requestBody({
//         intent: "CAPTURE",
//         purchase_units: [
//           {
//             amount: {
//               currency_code: "USD",
//               value: amount,
//             },
//           },
//         ],
//       });

//       const order = await paypalClient.execute(request);
//       paymentResult = {
//         paymentType: "paypal",
//         orderId: order.result.id,
//         redirectUrl: `https://www.paypal.com/checkoutnow?token=${order.result.id}`,
//       };
//     } else if (
//       freelancerPaymentMethod.billing_method === "Credit/Debit card" &&
//       paymentMethod === "stripe"
//     ) {
//       // Stripe payment logic
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: amount * 100, // Stripe expects amount in cents
//         currency: "usd",
//         payment_method:
//           freelancerPaymentMethod.card_details.stripe_payment_method_id,
//         confirm: true,
//       });

//       paymentResult = {
//         paymentType: "stripe",
//         paymentIntent: paymentIntent,
//       };
//     } else {
//       return res.status(400).json({
//         message:
//           "Invalid payment method or freelancer does not support this method",
//       });
//     } // Update the milestone or project status (if applicable)
//     // You can add logic here to mark the milestone as paid in your database

// // Return success response with updated project
// res.status(200).json({
//   success: true,
//   message: "Payment processed successfully",
//   // project: updatedProject,
//   paymentResult
// });

// } catch (err) {
//     console.error("Error processing payment:", err);
//     res
//       .status(500)
//       .json({ message: "Error processing payment", error: err.message });
//   }
// };

exports.processPaymentForFreelancer = async (req, res) => {
  try {
    const {
      freelancerId,
      jobId,
      milestoneId,
      amount,
      paymentMethod,
      projectId,
      client_id,
      proposal_id,
      paymentDetails, // Add this to receive payment details
    } = req.body;

    console.log("Received payment request:", {
      freelancerId,
      projectId,
      proposal_id,
      paymentDetails,
    });

    // Validate required fields
    if (!freelancerId || !proposal_id || !client_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

   // Get the latest project data
   const project = await Project.findOne({
    proposal_id: proposal_id,
    client_id: client_id
  }).sort({ createdAt: -1 });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Fetch the freelancer's payment method
    const freelancerPaymentMethod = await Payment_Method.findOne({
      client_id: freelancerId,
    });

    if (!freelancerPaymentMethod) {
      return res
        .status(404)
        .json({ message: "Freelancer payment method not found" });
    }

    let paymentResult;

    // Process payment based on method (PayPal or Stripe)
    if (
      freelancerPaymentMethod.billing_method === "Paypal" &&
      paymentMethod === "paypal"
    ) {
      // Existing PayPal payment logic...
    } else if (
      freelancerPaymentMethod.billing_method === "Credit/Debit card" &&
      paymentMethod === "stripe"
    ) {
      // Existing Stripe payment logic...
    } else {
      return res.status(400).json({
        message:
          "Invalid payment method or freelancer does not support this method",
      });
    }

    // Update project with payment details
    const updateData = {
      paymentStatus: "paid",
      
      paymentDetails: {
        transactionId: paymentDetails.orderId,
        paymentDate: new Date(),
        amount: amount,
        paymentMethod: paymentMethod,
        payerEmail: paymentDetails.payer?.email_address,
      },
    };

    // Handle milestone updates
    if (project.projectType === "milestone" && milestoneId) {
      try {
        // Update the specific milestone in the project
        await Project.updateOne(
          {
            proposal_id: proposal_id,
            client_id: client_id,
            "milestones._id": milestoneId
          },
          {
            $set: {
              "milestones.$.status": "Completed",
              "milestones.$.paid": true
            }
          }
        );


     // Get the updated project to calculate new progress
        const updatedProjectData = await Project.findOne({
          _id: project._id , // Using the _id from the latest project data
          proposal_id: proposal_id,
          client_id: client_id
        },
          { $set: updateData },
          { new: true }
        ).populate('freelancer_profile_id');

        if (!updatedProjectData) {
          throw new Error('Failed to fetch updated project data');
        }

       
        console.log('Milestone update successful:', {
          totalMilestones,
          completedMilestones,
          newProgress
        });

      } catch (milestoneError) {
        console.error('Error updating milestone:', milestoneError);
        throw new Error(`Failed to update milestone: ${milestoneError.message}`);
      }
    }

    // Update the project with all changes
    const finalUpdatedProject = await Project.findOneAndUpdate(
      {
        proposal_id: proposal_id,
        client_id: client_id
      },
      { $set: updateData },
      { new: true }
    ).sort({ createdAt: -1 });

    if (!finalUpdatedProject) {
      throw new Error('Project update failed');
    }

    // Check if all milestones are completed
    if (finalUpdatedProject.progress === 100) {
      console.log('All milestones completed - Project is ready for completion');
    }



    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      project: {
        finalUpdatedProject,
        paymentDetails: {
          transactionId: paymentDetails.orderId || paymentDetails.paymentIntentId,
          amount: amount,
          paymentMethod: paymentMethod,
          paymentDate: new Date(),
          status: 'paid'
        },
      progress: updateData.progress
    }});
  } catch (err) {
    console.error("Error processing payment:", err);
    res.status(500).json({
      message: "Error processing payment",
      error: err.message,
    });
  }
};

exports.markMilestoneAsPaid = async (req, res) => {
  try {
    const { milestoneId } = req.body; // Find the project containing the milestone and update the milestone's status

    const project = await Project.findOneAndUpdate(
      { "milestones._id": milestoneId }, // Locate the milestone by its ID
      { $set: { "milestones.$.status": "Paid" } }, // Update the status of the specific milestone
      { new: true } // Return the updated project
    );

    if (!project) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res.status(200).json({
      message: "Milestone marked as paid successfully",
      project,
    });
  } catch (err) {
    console.error("Error marking milestone as paid:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getMilestoneDetails = async (req, res) => {
  try {
    const { milestoneId } = req.params;

    // Find the milestone in the project
    const project = await Project.findOne(
      { "milestones._id": milestoneId },
      { "milestones.$": 1 }
    );

    if (!project) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res.status(200).json({ milestone: project.milestones[0] });
  } catch (err) {
    console.error("Error fetching milestone details:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getProjectMilestones = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find the project and return its milestones
    const project = await Project.findById(projectId, "milestones");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ milestones: project.milestones });
  } catch (err) {
    console.error("Error fetching project milestones:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
