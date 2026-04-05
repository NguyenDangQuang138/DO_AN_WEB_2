import axios from "axios";
import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import MyContext from "../contexts/MyContext";

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
    };
  }

  // Hàm tạo nhãn màu sắc cho trạng thái
  renderStatusBadge(status) {
    if (status === "PENDING") {
      return (
        <span className="status-badge status-pending">ĐANG CHỜ DUYỆT</span>
      );
    } else if (status === "APPROVED") {
      return <span className="status-badge status-approved">ĐÃ DUYỆT</span>;
    } else if (status === "CANCELED") {
      return <span className="status-badge status-canceled">ĐÃ HỦY</span>;
    }
    return <span className="status-badge">{status}</span>;
  }

  render() {
    if (this.context.token === "") return <Navigate replace to="/login" />;

    // 1. RENDER DANH SÁCH ĐƠN HÀNG
    const orders = this.state.orders.map((item) => {
      return (
        <tr key={item._id} onClick={() => this.trItemClick(item)}>
          <td style={{ fontWeight: "bold" }}>#{item._id.substring(0, 8)}...</td>{" "}
          {/* Rút gọn ID cho đỡ rối mắt */}
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td className="price-col">{item.total.toLocaleString()} đ</td>
          <td>{this.renderStatusBadge(item.status)}</td>
        </tr>
      );
    });

    // 2. RENDER CHI TIẾT 1 ĐƠN HÀNG
    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id}>
            <td>{index + 1}</td>
            <td>{item.product._id.substring(0, 8)}...</td>
            <td style={{ fontWeight: "500" }}>{item.product.name}</td>
            <td>
              <img
                src={"data:image/jpg;base64," + item.product.image}
                className="order-detail-img"
                alt={item.product.name}
              />
            </td>
            <td>{item.product.price.toLocaleString()} đ</td>
            <td align="center">{item.quantity}</td>
            <td className="price-col">
              {(item.product.price * item.quantity).toLocaleString()} đ
            </td>
          </tr>
        );
      });
    }

    return (
      <div className="myorders-page-container">
        {/* KHỐI 1: DANH SÁCH TẤT CẢ ĐƠN HÀNG */}
        <div className="orders-section">
          <h2>Lịch sử đơn hàng</h2>

          {this.state.orders.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="custom-table table-hover">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày đặt</th>
                    <th>Tên người nhận</th>
                    <th>Số điện thoại</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>{orders}</tbody>
              </table>
              <p
                style={{
                  fontSize: "13px",
                  color: "#888",
                  marginTop: "15px",
                  fontStyle: "italic",
                }}
              >
                * Click vào một đơn hàng bất kỳ để xem chi tiết
              </p>
            </div>
          ) : (
            <p style={{ textAlign: "center", padding: "30px", color: "#666" }}>
              Bạn chưa có đơn hàng nào.
            </p>
          )}
        </div>

        {/* KHỐI 2: CHI TIẾT ĐƠN HÀNG (Chỉ hiện khi click vào 1 đơn) */}
        {this.state.order && (
          <div className="orders-section">
            <h2 style={{ color: "#be1128" }}>
              Chi tiết đơn hàng #{this.state.order._id.substring(0, 8)}
            </h2>

            <div style={{ overflowX: "auto" }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mã SP</th>
                    <th>Tên sản phẩm</th>
                    <th>Hình ảnh</th>
                    <th>Đơn giá</th>
                    <th style={{ textAlign: "center" }}>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>{items}</tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }

  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
    // Tự động cuộn trang xuống phần chi tiết mượt mà
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  }

  // apis
  apiGetOrdersByCustID(cid) {
    const config = {
      headers: { "x-access-token": this.context.token },
    };

    axios.get("/api/customer/orders/customer/" + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}

export default Myorders;
