require("../utils/MongooseUtil");
const Models = require("./Models");

const CustomerDAO = {
  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username: username }, { email: email }] };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async insert(customer) {
    const mongoose = require("mongoose");
    customer._id = new mongoose.Types.ObjectId();
    const result = await Models.Customer.create(customer);
    return result;
  },
  async update(customer) {
    const newvalues = {
      username: customer.username,
      password: customer.password,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    };

    const result = await Models.Customer.findByIdAndUpdate(
      customer._id,
      newvalues,
      { new: true },
    );

    return result;
  },
  async active(_id, token, active) {
    const query = { _id: _id, token: token };
    const newvalues = { active: active };

    const result = await Models.Customer.findOneAndUpdate(query, newvalues, {
      new: true,
    });

    return result;
  },
  async activeByOTP(email, otp) {
    // Find customer by email
    const customer = await Models.Customer.findOne({ email: email });

    if (!customer) {
      return { success: false, message: "Email not found" };
    }

    // Check if OTP matches
    if (customer.activeOTP !== otp) {
      return { success: false, message: "Invalid OTP" };
    }

    // Check if OTP has expired (5 minutes = 300000 milliseconds)
    const now = new Date().getTime();
    const otpAge = now - customer.otpCreatedAt.getTime();
    const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

    if (otpAge > OTP_EXPIRY_TIME) {
      return { success: false, message: "OTP has expired" };
    }

    // Update customer to active and clear OTP
    const result = await Models.Customer.findByIdAndUpdate(
      customer._id,
      {
        active: 1,
        activeOTP: null,
        otpCreatedAt: null,
      },
      { new: true },
    );

    return {
      success: true,
      message: "Account activated successfully",
      customer: result,
    };
  },
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async selectAll() {
    const query = {};
    const customers = await Models.Customer.find(query).exec();
    return customers;
  },
  async selectByID(_id) {
    const customer = await Models.Customer.findById(_id).exec();
    return customer;
  },
};

module.exports = CustomerDAO;
