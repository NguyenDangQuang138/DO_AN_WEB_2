import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";

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

        <form>
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

  // ==========================================
  // ĐÃ CẬP NHẬT HÀM LOGIN ĐỂ LẤY LẠI GIỎ HÀNG
  // ==========================================
  apiLogin(account) {
    axios.post("/api/customer/login", account).then((res) => {
      const result = res.data;

      if (result.success === true) {
        // 1. Lưu token và thông tin user
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);

        // 2. KHÔI PHỤC GIỎ HÀNG TỪ DATABASE VÀO TRÌNH DUYỆT
        if (result.customer.cart && result.customer.cart.length > 0) {
          this.context.setMycart(result.customer.cart);
          localStorage.setItem("mycart", JSON.stringify(result.customer.cart));
          console.log("Đã khôi phục giỏ hàng từ Database!");
        } else {
          this.context.setMycart([]);
          localStorage.removeItem("mycart");
          console.log("Giỏ hàng trên Database đang trống.");
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
