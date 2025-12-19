const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendInvoiceEmail = async (to, order) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: to,
      subject: `Invoice for Order #${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Order Confirmation</h1>
          <p>Thank you for your purchase!</p>
          <p>Order Number: <strong>${order.orderNumber}</strong></p>
          <p>Total Amount: <strong>${order.totalAmount} EGP</strong></p>
          
          <h3>Items:</h3>
          <ul>
            ${order.items
              .map(
                (item) => `
              <li>
                ${item.quantity} x ${item.name || "Product"} - ${item.price} EGP
              </li>
            `
              )
              .join("")}
          </ul>
          
          <p>Payment Method: ${order.paymentMethod}</p>
          <p>Shipping Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}</p>
          
          <p>We are processing your order and will notify you when it ships.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = { sendInvoiceEmail };
