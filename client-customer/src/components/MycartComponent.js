import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import CartUtil from "../utils/CartUtil";
import axios from "axios";
import withRouter from "../utils/withRouter";

class Mycart extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      deliveryMethod: "Giao tận nơi",
      note: "",
    };
  }

  render() {
    const mycartItems = this.context.mycart.map((item, index) => {
      return (
        <div key={item.product._id} className="cart-item-card">
          <img
            src={"data:image/jpg;base64," + item.product.image}
            alt={item.product.name}
            className="cart-item-img"
          />

          <div className="cart-item-info">
            <div className="cart-item-name">{item.product.name}</div>
            <div className="cart-item-category">
              Loại: {item.product.category.name}
            </div>
            <button
              type="button"
              className="cart-item-remove-btn"
              onClick={() => this.lnkRemoveClick(item.product._id)}
            >
              Xóa khỏi giỏ
            </button>
          </div>

          <div className="cart-item-price">
            {item.product.price.toLocaleString()} đ
          </div>

          {/* BỘ ĐIỀU KHIỂN SỐ LƯỢNG MỚI */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div className="cart-item-qty-controls">
              <button
                className="qty-btn"
                onClick={() => this.updateQuantity(item.product._id, -1)}
              >
                -
              </button>
              <input
                type="text"
                className="qty-input"
                value={item.quantity}
                readOnly
              />
              <button
                className="qty-btn"
                onClick={() => this.updateQuantity(item.product._id, 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="cart-item-total">
            {(item.product.price * item.quantity).toLocaleString()} đ
          </div>
        </div>
      );
    });

    const totalAmount = CartUtil.getTotal(this.context.mycart);

    return (
      <div className="cart-page-container">
        {/* ================= CỘT TRÁI ================= */}
        <div className="cart-left-section">
          <h2>Giỏ hàng của bạn ({this.context.mycart.length} sản phẩm)</h2>

          {this.context.mycart.length > 0 ? (
            <div className="cart-items-list">{mycartItems}</div>
          ) : (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#888" }}
            >
              Giỏ hàng của bạn đang trống. Hãy quay lại cửa hàng để mua sắm nhé!
            </div>
          )}
        </div>

        {/* ================= CỘT PHẢI ================= */}
        {this.context.mycart.length > 0 && (
          <div className="cart-right-section">
            <h2>Thanh toán</h2>

            <div className="checkout-form-group">
              <div className="delivery-options">
                <button
                  className={`delivery-btn ${this.state.deliveryMethod === "Giao tận nơi" ? "active" : ""}`}
                  onClick={() =>
                    this.setState({ deliveryMethod: "Giao tận nơi" })
                  }
                >
                  🚚 Giao tận nơi
                </button>
                <button
                  className={`delivery-btn ${this.state.deliveryMethod === "Tự đến lấy" ? "active" : ""}`}
                  onClick={() =>
                    this.setState({ deliveryMethod: "Tự đến lấy" })
                  }
                >
                  📦 Tự đến lấy
                </button>
              </div>
            </div>

            <div className="checkout-form-group">
              <label className="checkout-label">Ghi chú đơn hàng</label>
              <textarea
                className="checkout-note"
                placeholder="Nhập ghi chú (VD: Giao giờ hành chính, gọi trước khi giao...)"
                value={this.state.note}
                onChange={(e) => this.setState({ note: e.target.value })}
              ></textarea>
            </div>

            <hr
              style={{
                border: "0",
                borderTop: "1px solid #eee",
                margin: "20px 0",
              }}
            />

            <div className="summary-row">
              <span>Tiền hàng ({this.context.mycart.length} món)</span>
              <span>{totalAmount.toLocaleString()} đ</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span>0 đ</span>
            </div>

            <div className="summary-row total">
              <span>Tổng tiền</span>
              <span className="price">{totalAmount.toLocaleString()} đ</span>
            </div>

            <button
              className="btn-checkout"
              onClick={() => this.lnkCheckoutClick()}
            >
              ĐẶT HÀNG
            </button>

            <p
              style={{
                fontSize: "12px",
                color: "#888",
                textAlign: "center",
                marginTop: "15px",
              }}
            >
              Bằng việc bấm vào nút "Đặt hàng", bạn đồng ý với chính sách của
              chúng tôi.
            </p>
          </div>
        )}
      </div>
    );
  }

  // --- EVENT HANDLERS ---

  // Hàm xử lý tăng giảm số lượng
  updateQuantity(id, change) {
    const mycart = this.context.mycart;
    const index = mycart.findIndex((x) => x.product._id === id);

    if (index !== -1) {
      const newQuantity = mycart[index].quantity + change;
      // Chỉ cho phép giảm tối đa về 1, không cho về 0
      if (newQuantity >= 1) {
        mycart[index].quantity = newQuantity;
        this.context.setMycart([...mycart]);
        localStorage.setItem("mycart", JSON.stringify(mycart));

        // BỔ SUNG: Báo Server cập nhật số lượng
        this.apiUpdateCart(mycart);
      }
    }
  }

  lnkRemoveClick(id) {
    const mycart = this.context.mycart;
    const index = mycart.findIndex((x) => x.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart([...mycart]);
      localStorage.setItem("mycart", JSON.stringify(mycart));

      // BỔ SUNG: Báo Server cập nhật giỏ hàng sau khi xóa
      this.apiUpdateCart(mycart);
    }
  }

  lnkCheckoutClick() {
    if (this.context.mycart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    if (window.confirm("Xác nhận đặt hàng?")) {
      const total = CartUtil.getTotal(this.context.mycart);
      const items = this.context.mycart;
      const customer = this.context.customer;

      if (customer) {
        this.apiCheckout(total, items, customer);
      } else {
        alert("Vui lòng đăng nhập để tiến hành thanh toán!");
        this.props.navigate("/login");
      }
    }
  }

  // ==========================================
  // HÀM GỬI LÊN DATABASE
  // ==========================================
  apiUpdateCart(mycart) {
    if (this.context.customer) {
      const body = {
        customerId: this.context.customer._id,
        cart: mycart,
      };
      axios
        .put("/api/customer/cart", body)
        .then((res) => {
          console.log("Cập nhật DB thành công!");
        })
        .catch((err) => {
          console.error("Lỗi khi lưu giỏ hàng: ", err);
        });
    }
  }

  // --- APIS ---
  apiCheckout(total, items, customer) {
    const body = { total: total, items: items, customer: customer };
    const config = {
      headers: { "x-access-token": this.context.token },
    };

    axios.post("/api/customer/checkout", body, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");

        // Xóa trắng giỏ hàng trên trình duyệt
        this.context.setMycart([]);
        localStorage.removeItem("mycart");

        // BỔ SUNG: Xóa trắng giỏ hàng dưới Database để chuẩn bị đơn mới
        this.apiUpdateCart([]);

        this.props.navigate("/home");
      } else {
        alert("Đặt hàng thất bại, vui lòng thử lại sau!");
      }
    });
  }
}

export default withRouter(Mycart);
