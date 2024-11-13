// components/ReviewModal.jsx
import React, { useState } from 'react';
import { Modal, Rate, Input, Form, Button } from 'antd';

const ReviewModal = ({ visible, onClose, onSubmit, freelancerName }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={`Rate your experience with ${freelancerName}`}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit Review
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="rating"
          label="Rating"
          rules={[{ required: true, message: 'Please give a rating' }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          name="review"
          label="Review"
          rules={[{ required: true, message: 'Please write a review' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReviewModal;