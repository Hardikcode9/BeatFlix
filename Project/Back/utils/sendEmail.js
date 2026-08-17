const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"BeatFlix" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "BeatFlix Email Verification",

    html: `
      <div style="
        max-width:600px;
        margin:auto;
        padding:40px;
        font-family:Arial,sans-serif;
        background:#0f172a;
        color:white;
        border-radius:20px;
      ">

      <h1 style="color:#4f8cff;">
        BeatFlix
      </h1>

      <p>
        Thank you for creating your BeatFlix account.
      </p>

      <p>
        Your verification code is:
      </p>

      <h2 style="
        font-size:40px;
        letter-spacing:10px;
        color:#38bdf8;
      ">
        ${otp}
      </h2>

      <p>
        This code expires in 5 minutes.
      </p>

      <hr>

      <small>
        If you didn't request this code, you can safely ignore this email.
      </small>

      </div>
    `,
  });
};

module.exports = sendOTP;