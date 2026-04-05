require("../utils/MongooseUtil");
const Models = require("./Models");

const NewsDAO = {
  async selectAll() {
    const query = {};
    // Lấy tất cả bài viết, sắp xếp theo ngày đăng mới nhất (cdate: -1)
    const news = await Models.News.find(query).sort({ cdate: -1 }).exec();
    return news;
  },
  async insert(news) {
    const mongoose = require("mongoose");
    news._id = new mongoose.Types.ObjectId();
    const result = await Models.News.create(news);
    return result;
  },
  async update(news) {
    const newvalues = {
      title: news.title,
      summary: news.summary,
      content: news.content,
      image: news.image,
    };
    const result = await Models.News.findByIdAndUpdate(news._id, newvalues, {
      new: true,
    });
    return result;
  },
  async delete(_id) {
    const result = await Models.News.findByIdAndDelete(_id);
    return result;
  },
  async selectByID(_id) {
    const news = await Models.News.findById(_id).exec();
    return news;
  },
};

module.exports = NewsDAO;
