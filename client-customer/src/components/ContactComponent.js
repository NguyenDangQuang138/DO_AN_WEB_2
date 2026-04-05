import React, { Component } from "react";
import "./styles/home.css"; // Dùng chung file css hiện tại

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: "",
      title: "",
      content: "",
      fullname: "",
      email: "",
      phone: "",
    };
  }

  render() {
    return (
      <div className="home-container" style={{ padding: "40px 20px" }}>
        {/* Khung chứa form liên hệ */}
        <div className="contact-wrapper">
          <h2 className="contact-heading">
            CHÚNG TÔI XIN HÂN HẠNH ĐƯỢC HỖ TRỢ QUÝ KHÁCH
          </h2>

          <form className="contact-form" onSubmit={(e) => this.handleSubmit(e)}>
            {/* Chọn chủ đề */}
            <div className="form-group">
              <label>Quý khách đang quan tâm về:</label>
              <select
                value={this.state.topic}
                onChange={(e) => this.setState({ topic: e.target.value })}
                required
              >
                <option value="" disabled hidden>
                  Chọn chủ đề
                </option>
                <option value="Bảo hành">Bảo hành</option>
                <option value="Tư vấn mua hàng">Tư vấn mua hàng</option>
                <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật</option>
                <option value="Khiếu nại">Góp ý / Khiếu nại</option>
              </select>
            </div>

            {/* Tiêu đề */}
            <div className="form-group">
              <label>Tiêu đề:</label>
              <input
                type="text"
                placeholder="Quý khách vui lòng nhập tiêu đề"
                value={this.state.title}
                onChange={(e) => this.setState({ title: e.target.value })}
                required
              />
            </div>

            {/* Nội dung */}
            <div className="form-group">
              <label>Nội dung:</label>
              <textarea
                rows="5"
                placeholder="Xin quý khách vui lòng mô tả chi tiết"
                value={this.state.content}
                onChange={(e) => this.setState({ content: e.target.value })}
                required
              ></textarea>
            </div>

            {/* Họ và tên */}
            <div className="form-group">
              <label>Họ và tên:</label>
              <input
                type="text"
                placeholder="Nhập họ tên"
                value={this.state.fullname}
                onChange={(e) => this.setState({ fullname: e.target.value })}
                required
              />
            </div>

            {/* Dòng chứa Email và SĐT (Chia 2 cột) */}
            <div className="form-row">
              <div className="form-group">
                <label>Địa chỉ Email:</label>
                <input
                  type="email"
                  placeholder="Nhập Email"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="tel"
                  placeholder="Nhập sđt"
                  value={this.state.phone}
                  onChange={(e) => this.setState({ phone: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Nút Submit */}
            <button type="submit" className="btn-contact-submit">
              GỬI LIÊN HỆ
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Hàm xử lý khi bấm gửi
  handleSubmit(e) {
    e.preventDefault(); // Chặn việc trang web bị reload lại

    // Ở đây sau này bạn có thể gọi API gửi data về Backend
    // Hiện tại mình cho hiện thông báo thành công
    alert(
      "Cảm ơn " +
        this.state.fullname +
        ". Yêu cầu của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất!",
    );

    // Xóa trắng form sau khi gửi
    this.setState({
      topic: "",
      title: "",
      content: "",
      fullname: "",
      email: "",
      phone: "",
    });
  }
}

export default Contact;
