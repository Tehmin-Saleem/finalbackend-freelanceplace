const Payment_Method = require('../models/payment_method.model');


exports.createPaymentMethod = async (req, res) => {
  try {
    const {
      billing_method,
      card_details,
      paypal_details,
      freelancer_id
    } = req.body;

    const client_id = req.user._id; 

    const newPaymentMethod = new Payment_Method({
      billing_method,
      client_id,
      freelancer_id,
      card_details,
      paypal_details,
    });

    await newPaymentMethod.save();
    res.status(201).json({ message: 'Payment method created successfully', paymentMethod: newPaymentMethod });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


exports.getClientPaymentMethods = async (req, res) => {
  try {
    const client_id = req.user._id;

    const paymentMethods = await Payment_Method.find({ client_id }).populate('freelancer_id');

    res.status(200).json({ paymentMethods });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


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
