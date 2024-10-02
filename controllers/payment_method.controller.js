const Payment_Method = require('../models/payment_method.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentMethod = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { type, paymentMethodId, email, userId, card } = req.body;

    let paymentMethod;

    // Check if a payment method already exists for this user
    const existingPaymentMethod = await Payment_Method.findOne({ client_id: userId });

    if (type === 'credit') {
      console.log('Processing credit card payment method');
      
      // Retrieve the payment method from Stripe to get additional details
      const stripePaymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

      paymentMethod = {
        billing_method: 'Credit/Debit card',
        client_id: userId,
        card_details: {
          stripe_payment_method_id: paymentMethodId,
          last4: card.last4,
          brand: card.brand,
          exp_month: card.exp_month,
          exp_year: card.exp_year
        }
      };
    } else if (type === 'paypal') {
      console.log('Processing PayPal payment method');
      paymentMethod = {
        billing_method: 'Paypal',
        client_id: userId,
        paypal_details: {
          email: email
        }
      };
    } else {
      console.log('Invalid payment method type:', type);
      return res.status(400).json({ message: 'Invalid payment method type' });
    }

    let result;
    if (existingPaymentMethod) {
      console.log('Updating existing payment method for user:', userId);
      result = await Payment_Method.findOneAndUpdate(
        { client_id: userId },
        paymentMethod,
        { new: true, runValidators: true }
      );
      console.log('Payment method updated successfully');
    } else {
      console.log('Creating new payment method for user:', userId);
      result = await Payment_Method.create(paymentMethod);
      console.log('New payment method created successfully');
    }

    res.status(200).json({ 
      message: existingPaymentMethod ? 'Payment method updated successfully' : 'Payment method created successfully', 
      paymentMethod: result,
      nextStep: '/api/client/process-payment'
    });
  } catch (err) {
    console.error('Error in createPaymentMethod:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
// New function for processing payments
exports.processPayment = async (req, res) => {
  try {
    const { paymentMethodId, amount, currency = 'usd' } = req.body;
    const { userId } = req.user; // Assuming you have middleware to extract user info from token

    // Retrieve the payment method
    const paymentMethod = await Payment_Method.findOne({ 
      client_id: userId,
      'card_details.stripe_payment_method_id': paymentMethodId 
    });

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    let paymentIntent;

    if (paymentMethod.billing_method === 'Credit/Debit card') {
      // Process credit card payment
      paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in cents
        currency: currency,
        payment_method: paymentMethodId,
        confirm: true,
      });
    } else if (paymentMethod.billing_method === 'Paypal') {
      // For PayPal, you would typically redirect the user to PayPal's checkout
      // This is a placeholder for PayPal integration
      return res.status(200).json({ 
        message: 'Redirect to PayPal', 
        redirectUrl: `https://www.paypal.com/checkoutnow?token=${paymentMethodId}` 
      });
    }

    res.status(200).json({ 
      message: 'Payment processed successfully', 
      paymentIntent: paymentIntent 
    });
  } catch (err) {
    console.error('Error processing payment:', err);
    res.status(500).json({ message: 'Error processing payment', error: err.message });
  }
};
exports.getClientPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await Payment_Method.find();

    if (paymentMethods.length === 0) {
      return res.status(200).json({ message: 'No payment methods found', paymentMethods: [] });
    }

    const formattedPaymentMethods = paymentMethods.reduce((acc, method) => {
      acc[method.client_id.toString()] = {
        _id: method._id,
        client_id: method.client_id,
        billing_method: method.billing_method,
        card_details: method.card_details,
        paypal_details: method.paypal_details
      };
      return acc;
    }, {});

    res.status(200).json({ paymentMethods: formattedPaymentMethods });
  } catch (err) {
    console.error('Error fetching payment methods:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
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

    const paymentMethod = await Payment_Method.findOne({ _id: paymentMethodId, client_id }).populate('freelancer_id');

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found or unauthorized' });
    }

    res.status(200).json({ paymentMethod });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
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
      return res.status(404).json({ message: 'Payment method not found or unauthorized' });
    }

    res.status(200).json({ message: 'Payment method updated successfully', paymentMethod: updatedPaymentMethod });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


exports.deletePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const client_id = req.user._id;

    const deletedPaymentMethod = await Payment_Method.findOneAndDelete({ _id: paymentMethodId, client_id });

    if (!deletedPaymentMethod) {
      return res.status(404).json({ message: 'Payment method not found or unauthorized' });
    }

    res.status(200).json({ message: 'Payment method deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
