import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
// Nhớ tạo file CSS riêng này hoặc dán vào file CSS chung của Admin nhé

class Contact extends Component {
  static contextType = MyContext; // Để lấy Admin token

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      itemSelected: null, // Lưu trữ liên hệ đang được chọn để xem
    };
  }

  render() {
    // 1. Render danh sách các hàng trong bảng bên trái (Master)
    const items = this.state.contacts.map((item) => (
      <tr
        key={item._id}
        className={`datatable-row ${this.state.itemSelected?._id === item._id ? "selected" : ""}`}
        onClick={() => this.setState({ itemSelected: item })}
      >
        <td>{item.topic}</td>
        <td>{item.fullname}</td>
        <td>{new Date(item.cdate).toLocaleDateString(" ")}</td>
        <td className="text-center">
          <button
            className="btn-action btn-delete-small"
            onClick={(e) => this.btnDeleteClick(e, item._id)}
          >
            Xóa
          </button>
        </td>
      </tr>
    ));

    return (
      <div className="admin-contact-main-container">
        {/* =======================================================
            CỘT TRÁI: DANH SÁCH LIÊN HỆ (MASTER LIST)
            ======================================================= */}
        <div className="admin-contact-list-box">
          <h2 className="admin-section-title">DANH SÁCH LIÊN HỆ</h2>
          <div className="table-scroll-wrapper">
            <table className="admin-datatable">
              <thead>
                <tr>
                  <th>Chủ đề</th>
                  <th>Khách hàng</th>
                  <th>Ngày gửi</th>
                  <th>Lệnh</th>
                </tr>
              </thead>
              <tbody>
                {this.state.contacts.length > 0 ? (
                  items
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Chưa có liên hệ nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =======================================================
            CỘT PHẢI: CHI TIẾT NỘI DUNG (DETAIL VIEW)
            ======================================================= */}
        <div className="admin-contact-detail-box">
          <h2 className="admin-section-title">NỘI DUNG CHI TIẾT</h2>

          {this.state.itemSelected ? (
            // TRƯỜNG HỢP 1: ĐÃ CHỌN MỘT TIN NHẮN
            <div className="contact-detail-active">
              <div className="info-grid">
                <p>
                  <strong>Khách hàng:</strong>{" "}
                  {this.state.itemSelected.fullname}
                </p>
                <p>
                  <strong>Email:</strong> {this.state.itemSelected.email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{" "}
                  {this.state.itemSelected.phone}
                </p>
                <p>
                  <strong>Ngày gửi:</strong>{" "}
                  {new Date(this.state.itemSelected.cdate).toLocaleString()}
                </p>
              </div>
              <p>
                <strong>Chủ đề:</strong>{" "}
                <span className="highlight-text">
                  {this.state.itemSelected.topic}
                </span>
              </p>
              <p>
                <strong>Tiêu đề:</strong> {this.state.itemSelected.title}
              </p>
              <hr className="divider" />
              <p>
                <strong>Nội dung tin nhắn:</strong>
              </p>
              <div className="message-content-area">
                {this.state.itemSelected.content}
              </div>
            </div>
          ) : (
            // TRƯỜNG HỢP 2: CHƯA CHỌN TIN NHẮN NÀO (GIỐNG ẢNH MẪU 4)
            <div className="contact-detail-empty">
              <div className="empty-placeholder">
                Chọn một liên hệ từ danh sách bên trái để xem nội dung chi tiết.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- LIFECYCLE ---
  componentDidMount() {
    this.apiGetContacts();
  }

  // --- EVENT HANDLERS ---
  btnDeleteClick(e, id) {
    e.stopPropagation(); // Ngăn click vào nút bị hiểu nhầm là click chọn dòng
    if (window.confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) {
      this.apiDeleteContact(id);
    }
  }

  // --- APIS ---
  apiGetContacts() {
    if (!this.context.token) return;
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/contacts", config).then((res) => {
      this.setState({ contacts: res.data });
    });
  }

  apiDeleteContact(id) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.delete("/api/admin/contacts/" + id, config).then((res) => {
      if (res.data) {
        alert("Đã xóa liên hệ thành công!");
        // Nếu xóa đúng tin nhắn đang xem thì đóng khung chi tiết
        if (this.state.itemSelected?._id === id) {
          this.setState({ itemSelected: null });
        }
        this.apiGetContacts(); // Tải lại danh sách
      }
    });
  }
}

export default Contact;
