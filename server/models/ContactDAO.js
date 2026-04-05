require("../utils/MongooseUtil");
const Models = require("./Models");

const ContactDAO = {
  async insert(contact) {
    const mongoose = require("mongoose");
    contact._id = new mongoose.Types.ObjectId();
    const result = await Models.Contact.create(contact);
    return result;
  },
  async selectAll() {
    const query = {};
    const contacts = await Models.Contact.find(query)
      .sort({ cdate: -1 })
      .exec();
    return contacts;
  },
  async delete(_id) {
    const result = await Models.Contact.findByIdAndDelete(_id);
    return result;
  },
};
module.exports = ContactDAO;
