const mongoose = require("mongoose");

// Schemas
const AdminSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
  },
  { versionKey: false },
);

const CategorySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
  { versionKey: false },
);

const CustomerSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    phone: String,
    email: String,
    active: Number,
    token: String,
    activeOTP: String,
    otpCreatedAt: Date,
    cart: { type: Array, default: [] },
  },
  { versionKey: false },
);

const ProductSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    image: String,
    details: String,
    cdate: Number,
    category: CategorySchema,
  },
  { versionKey: false },
);

const ItemSchema = new mongoose.Schema(
  {
    product: ProductSchema,
    quantity: Number,
  },
  { versionKey: false, _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    cdate: Number,
    total: Number,
    status: String,
    customer: CustomerSchema,
    items: [ItemSchema],
  },
  { versionKey: false },
);

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true }, // Đoạn tóm tắt ngắn ngoài trang chủ
    content: { type: String, required: true }, // Lưu toàn bộ nội dung (bao gồm thẻ HTML)
    image: { type: String, required: true }, // Lưu ảnh bìa dạng base64
    cdate: { type: Number, default: Date.now }, // Tự động lấy ngày giờ đăng bài
  },
  { versionKey: false },
);

const ContactSchema = new mongoose.Schema(
  {
    topic: String,
    title: String,
    content: String,
    fullname: String,
    email: String,
    phone: String,
    cdate: Number,
    status: { type: String, default: "NEW" },
  },
  { versionKey: false },
);
// Models
const Admin = mongoose.model("Admin", AdminSchema);
const Category = mongoose.model("Category", CategorySchema);
const Customer = mongoose.model("Customer", CustomerSchema);
const Product = mongoose.model("Product", ProductSchema);
const Order = mongoose.model("Order", OrderSchema);
const News = mongoose.model("news", NewsSchema);
const Contact = mongoose.model("Contact", ContactSchema, "contacts");

module.exports = {
  Admin,
  Category,
  Customer,
  Product,
  Order,
  News,
  Contact,
};
