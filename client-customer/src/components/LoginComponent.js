import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";

// ========================================================
// HÀM LƯU DỮ LIỆU CÓ THỜI HẠN (Viết thẳng vào đây cho khỏi lỗi)
// ========================================================
const setWithExpiry = (key, value, ttl) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl, // Cộng thêm thời gian sống
  };
  localStorage.setItem(key, JSON.stringify(item));
};

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: "",
      txtPassword: "",
    };
  }

  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">CUSTOMER LOGIN</h2>

        <form onSubmit={(e) => this.btnLoginClick(e)}>
          <table className="align-center">
            <tbody>
              <tr>
                <td>Username</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtUsername}
                    onChange={(e) => {
                      this.setState({ txtUsername: e.target.value });
                    }}
                  />
                </td>
              </tr>

              <tr>
                <td>Password</td>
                <td>
                  <input
                    type="password"
                    value={this.state.txtPassword}
                    onChange={(e) => {
                      this.setState({ txtPassword: e.target.value });
                    }}
                  />
                </td>
              </tr>

              <tr>
                <td></td>
                <td>
                  <input
                    type="submit"
                    value="LOGIN"
                    onClick={(e) => this.btnLoginClick(e)}
                  />
                </td>
              </tr>
              <span>
                Bạn chưa có tài khoản? <a href="./Signup">Đăng ký ngay</a>
              </span>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;

    if (username && password) {
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      alert("Please input username and password");
    }
  }

  apiLogin(account) {
    axios.post("/api/customer/login", account).then((res) => {
      const result = res.data;

      if (result.success === true) {
        // ========================================================
        // TEST NHANH 15 GIÂY (Test xong thì xóa dòng này đi)
        const THOI_GIAN_SONG = 15 * 60 * 1000;

        // KHI NÀO CHẠY THẬT THÌ DÙNG DÒNG NÀY (24 Tiếng)
        // const THOI_GIAN_SONG = 24 * 60 * 60 * 1000;
        // ========================================================

        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);

        // 1. Lưu Token và User có thời hạn (dùng hàm mới)
        setWithExpiry("customer_token", result.token, THOI_GIAN_SONG);
        setWithExpiry("customer_user", result.customer, THOI_GIAN_SONG);

        // 2. Lưu Giỏ hàng KHÔNG có thời hạn (Sống vĩnh viễn)
        if (result.customer.cart && result.customer.cart.length > 0) {
          this.context.setMycart(result.customer.cart);
          localStorage.setItem("mycart", JSON.stringify(result.customer.cart));
        } else {
          this.context.setMycart([]);
          localStorage.removeItem("mycart");
        }

        // 3. Chuyển hướng
        this.props.navigate("/home");
      } else {
        alert(result.message);
      }
    });
  }
}

export default withRouter(Login);
