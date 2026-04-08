import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MyContext from "../contexts/MyContext";

class Home extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      stats: {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
      },
      recentOrders: [],
    };
  }

  componentDidMount() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    const config = { headers: { "x-access-token": this.context.token } };

    Promise.all([
      axios.get("/api/admin/orders", config),
      axios.get("/api/admin/products", config),
      axios.get("/api/admin/customers", config),
    ])
      .then(([resOrders, resProducts, resCustomers]) => {
        const orders = resOrders.data || [];
        const customers = resCustomers.data || [];

        const productsObj = resProducts.data || {};
        const productList = productsObj.products || [];

        const revenue = Array.isArray(orders)
          ? orders.reduce((sum, order) => sum + (order.total || 0), 0)
          : 0;

        const allOrders = Array.isArray(orders) ? [...orders].reverse() : [];

        this.setState({
          stats: {
            totalRevenue: revenue,
            totalOrders: Array.isArray(orders) ? orders.length : 0,
            totalProducts: productsObj.totalCount || productList.length,
            totalCustomers: Array.isArray(customers) ? customers.length : 0,
          },
          recentOrders: allOrders,
        });
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu Dashboard: ", err);
      });
  }

  render() {
    const { stats, recentOrders } = this.state;

    return (
      <div className="admin-layout">
        {/* Đã xóa phần <aside> Menu thừa ở đây */}

        {/* ================= KHU VỰC NỘI DUNG CHÍNH (Đã được mở rộng toàn màn hình) ================= */}
        <main className="admin-main-content">
          <header className="admin-header">
            <h2>Tổng quan hệ thống</h2>
            <div className="admin-profile">
              <span>
                Xin chào, <b>{this.context.username || "Admin"}</b>
              </span>
            </div>
          </header>

          {/* CÁC THẺ THỐNG KÊ (CARDS) */}
          <div className="admin-stats-grid">
            <div className="stat-card bg-orange">
              <h3>Doanh thu tổng</h3>
              <p className="stat-value">
                {stats.totalRevenue.toLocaleString()} đ
              </p>
            </div>
            <div className="stat-card bg-blue">
              <h3>Tổng đơn hàng</h3>
              <p className="stat-value">{stats.totalOrders}</p>
            </div>
            <div className="stat-card bg-green">
              <h3>Tổng sản phẩm</h3>
              <p className="stat-value">{stats.totalProducts}</p>
            </div>
            <div className="stat-card bg-purple">
              <h3>Khách hàng</h3>
              <p className="stat-value">{stats.totalCustomers}</p>
            </div>
          </div>

          {/* BẢNG ĐƠN HÀNG GẦN ĐÂY */}
          <div className="admin-recent-orders">
            <h3>Đơn hàng gần đây</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <b>{order._id.substring(order._id.length - 6)}</b>
                      </td>
                      <td>
                        {order.customer ? order.customer.name : "Khách vô danh"}
                      </td>
                      <td>
                        {order.items && order.items.length > 0
                          ? `${order.items[0].product.name} ${
                              order.items.length > 1
                                ? `(+${order.items.length - 1} món)`
                                : ""
                            }`
                          : "Đang cập nhật"}
                      </td>
                      <td style={{ color: "#e55a25", fontWeight: "bold" }}>
                        {(order.total || 0).toLocaleString()} đ
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            order.status === "APPROVED"
                              ? "done"
                              : order.status === "CANCELED"
                                ? "pending"
                                : "shipping"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/admin/order`}
                          className="btn-action"
                          style={{ textDecoration: "none" }}
                        >
                          Xem
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Chưa có đơn hàng nào hoặc đang tải dữ liệu...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }
}

export default Home;
