import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext";

class Menu extends Component {
  static contextType = MyContext;

  render() {
    return (
      <div className="border-bottom sticky-menu">
        <div className="menu-header">
          {/* Logo */}
          <Link to="/home" className="logo-container">
            <img
              src="/image/Gemini_Generated_Image_4kii5o4kii5o4kii.png"
              alt="Logo"
              className="logo-img"
            />
          </Link>
          {/* Các link điều hướng */}
          <div className="nav-links">
            <Link className="category-link home-link" to="/">
              Trang chủ
            </Link>
            <Link className="category-link home-link" to="/shop">
              Sản phẩm
            </Link>
            <Link className="category-link home-link" to="/news">
              Tin tức
            </Link>
            <Link className="category-link home-link" to="/contact">
              Liên hệ
            </Link>
          </div>
          <div className="user-auth-section">
            {this.context.token === "" ? (
              <div>
                <Link to="/login" className="category-link home-link">
                  Login
                </Link>{" "}
                |{" "}
                <Link to="/signup" className="category-link home-link">
                  Sign-up
                </Link>{" "}
              </div>
            ) : (
              <div>
                Hello <b>{this.context.customer.name}</b> |{" "}
                <Link
                  to="/home"
                  className="category-link home-link"
                  onClick={() => this.lnkLogoutClick()}
                >
                  Logout
                </Link>{" "}
                |{" "}
                <Link to="/myprofile" className="category-link home-link">
                  My profile
                </Link>{" "}
                |{" "}
                <Link to="/myorders" className="category-link home-link">
                  My orders
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Hàm xử lý Đăng xuất
  lnkLogoutClick() {
    this.context.setToken("");
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }
}

export default withRouter(Menu);
