const nodemailer = require("nodemailer");
const MyConstants = require("./MyConstants");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS,
  },
});

const EmailUtil = {
  send(email, otp) {
    const text =
      "Thank you for signing up! Please use this OTP code to activate your account:\n\n" +
      "\t- OTP Code: " +
      otp +
      "\n\n" +
      "This code will expire in 5 minutes.\n" +
      "If you did not sign up, please ignore this email.";

    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: "Signup | Verification OTP",
        text: text,
      };

      transporter.sendMail(mailOptions, (err, result) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  },
};

module.exports = EmailUtil;
