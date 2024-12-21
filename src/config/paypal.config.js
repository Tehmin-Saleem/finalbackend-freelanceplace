export const PAYPAL_CLIENT_ID = 'AeD2FXVPn4BTV9vIQVM_i48QFj7Ct6tNVgu_9537MIiAY4WJjxBUnzYLhiYNQke9F8d7JO1wTegY1aWG';

export const PAYPAL_OPTIONS = {
"client-id": PAYPAL_CLIENT_ID,
currency: "USD",
intent: "capture",
// Set to "sandbox" for testing
// "data-client-token": "sandbox_token",
};



// Add sandbox account details for testing
export const SANDBOX_ACCOUNTS = {
    client: {
      email: "client-sandbox@example.com",
      password: "your_sandbox_password"
    },
    freelancer: {
      email: "freelancer-sandbox@example.com",
      password: "your_sandbox_password",
      merchantId: "MERCHANT_ID"
    }
  };