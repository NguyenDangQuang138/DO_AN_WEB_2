const CryptoUtil = {
  md5(input) {
    const crypto = require("crypto");
    const hash = crypto.createHash("md5").update(input).digest("hex");
    return hash;
  },
  generateOTP() {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  },
};

module.exports = CryptoUtil;
