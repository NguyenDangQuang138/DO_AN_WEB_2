import React, { Component } from "react";
import MyContext from "./MyContext";

// ========================================================
// HÀM LẤY DỮ LIỆU VÀ KIỂM TRA HẾT HẠN (Viết thẳng vào đây)
// ========================================================
const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null; // Không có gì thì báo null

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    // Nếu hiện tại lớn hơn giờ hết hạn -> XÓA và báo null
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value; // Nếu còn hạn thì trả về dữ liệu thật
  } catch (error) {
    return null; // Bắt lỗi trường hợp code cũ đang lưu sai định dạng
  }
};

class MyProvider extends Component {
  constructor(props) {
    super(props);

    // 1. Gọi hàm mới để lấy Token và User (Tự động loại bỏ nếu hết 15s)
    const storedToken = getWithExpiry("customer_token") || "";
    const storedCustomer = getWithExpiry("customer_user") || null;

    let storedCart = [];
    try {
      // 2. Giỏ hàng thì vẫn lấy bình thường vì nó sống vĩnh viễn
      const cartData = localStorage.getItem("mycart");
      if (cartData) storedCart = JSON.parse(cartData);
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu từ localStorage:", error);
    }

    this.state = {
      // variables
      token: storedToken,
      customer: storedCustomer,
      mycart: storedCart,
      // functions
      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart,
    };
  }

  setMycart = (value) => {
    this.setState({ mycart: value });
  };
  setToken = (value) => {
    this.setState({ token: value });
  };
  setCustomer = (value) => {
    this.setState({ customer: value });
  };

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;
