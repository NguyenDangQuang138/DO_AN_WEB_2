import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";

class ContactComponent extends Component {
  static contextType = MyContext; // Để lấy token admin

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      itemSelected: null, // Lưu trữ liên hệ đang được xem chi tiết
    };
  }

  render() {
    // Render danh sách các hàng trong bảng bên trái
    const items = this.state.contacts.map((item) => (
      <tr
        key={item._id}
        className="datatable"
        onClick={() => this.setState({ itemSelected: item })}
      >
        <td>{item.topic}</td>
        <td>{item.fullname}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>
          <button
            className="btn-delete-small"
            onClick={(e) => this.btnDeleteClick(e, item._id)}
          >
            Xóa
          </button>
        </td>
      </tr>
    ));

    return (
      <div className="admin-container">
        {/* CỘT TRÁI: DANH SÁCH LIÊN HỆ */}
        <div className="admin-list-box">
          <h2 className="text-center">DANH SÁCH LIÊN HỆ</h2>
          <table className="datatable">
            <tbody>
              <tr>
                <th>Chủ đề</th>
                <th>Khách hàng</th>
                <th>Ngày gửi</th>
                <th>Lệnh</th>
              </tr>
              {items}
            </tbody>
          </table>
        </div>

        {/* CỘT PHẢI: CHI TIẾT NỘI DUNG LIÊN HỆ */}
        <div className="admin-detail-box">
          <h2 className="text-center">NỘI DUNG CHI TIẾT</h2>
          {this.state.itemSelected ? (
            <div className="contact-detail-content">
              <p>
                <strong>Khách hàng:</strong> {this.state.itemSelected.fullname}
              </p>
              <p>
                <strong>Email:</strong> {this.state.itemSelected.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {this.state.itemSelected.phone}
              </p>
              <p>
                <strong>Chủ đề:</strong> {this.state.itemSelected.topic}
              </p>
              <p>
                <strong>Tiêu đề:</strong> {this.state.itemSelected.title}
              </p>
              <hr />
              <p>
                <strong>Nội dung tin nhắn:</strong>
              </p>
              <div className="message-box">
                {this.state.itemSelected.content}
              </div>
            </div>
          ) : (
            <p className="text-center" style={{ color: "#888" }}>
              Chọn một liên hệ để xem chi tiết
            </p>
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
    e.stopPropagation(); // Chặn sự kiện click vào dòng table
    if (window.confirm("Xóa liên hệ này?")) {
      this.apiDeleteContact(id);
    }
  }

  // --- APIS ---
  apiGetContacts() {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/contacts", config).then((res) => {
      const result = res.data;
      this.setState({ contacts: result });
    });
  }

  apiDeleteContact(id) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.delete("/api/admin/contacts/" + id, config).then((res) => {
      if (res.data) {
        alert("Đã xóa liên hệ thành công!");
        this.setState({ itemSelected: null }); // Xóa xong thì đóng khung chi tiết
        this.apiGetContacts();
      }
    });
  }
}

export default ContactComponent;
