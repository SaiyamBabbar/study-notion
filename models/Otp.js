const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

// a function to send email

async function sendverificationemail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "verification email form studynotion",
      otp
    );
    console.log("email sent Succesfully", mailResponse);
  } catch (error) {
    console.log("error occured while send mail:", error);
    throw error;
  }
}

OtpSchema.pre("save", async function (next) {
  await sendverificationemail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OtpSchema);
