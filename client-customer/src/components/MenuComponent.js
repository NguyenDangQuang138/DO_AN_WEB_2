import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext";

class Menu extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      isMobileMenuOpen: false,
      isUserMenuOpen: false, // 👈 THÊM CÔNG TẮC ĐỂ MỞ MENU NGƯỜI DÙNG
    };
  }

  render() {
    return (
      <div className="border-bottom sticky-menu">
        <div className="menu-header">
          {/* Nút 3 gạch cho điện thoại */}
          <button
            className="menu-toggle"
            onClick={() =>
              this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen })
            }
          >
            ☰
          </button>

          {/* Logo Web */}
          <Link to="/home" className="logo-container">
            <img
              src="/image/Gemini_Generated_Image_4kii5o4kii5o4kii.png"
              alt="Logo"
              className="logo-img"
            />
          </Link>

          {/* Nav Links */}
          <div
            className={`nav-links ${this.state.isMobileMenuOpen ? "menu-open" : ""}`}
          >
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
              <div
                className="logged-in-user"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* 1. KHỐI AVATAR NGƯỜI DÙNG (Bấm vào để mở Dropdown trên điện thoại) */}
                <div
                  className="user-avatar-wrapper"
                  onClick={() =>
                    this.setState({
                      isUserMenuOpen: !this.state.isUserMenuOpen,
                    })
                  }
                  style={{ cursor: "pointer" }}
                  title="Menu tài khoản"
                >
                  <img
                    src="/image/user.png" /* 👈 SỬA ĐƯỜNG DẪN ẢNH CỦA BẠN VÀO ĐÂY */
                    alt="User Logo"
                    className="user-avatar-img"
                  />
                </div>

                {/* 2. CỤM CHỮ SẼ TRỞ THÀNH DROPDOWN TRÊN MOBILE */}
                <div
                  className={`user-dropdown-menu ${this.state.isUserMenuOpen ? "open" : ""}`}
                >
                  <span className="user-name-text">
                    Hello <b>{this.context.customer.name}</b>
                  </span>

                  <span className="desktop-divider"> | </span>
                  <Link to="/myprofile" className="user-menu-link">
                    My profile
                  </Link>
                  <span className="desktop-divider"> | </span>
                  <Link to="/myorders" className="user-menu-link">
                    My orders
                  </Link>
                  <span className="desktop-divider"> | </span>
                  <Link
                    to="/home"
                    className="user-menu-link"
                    onClick={() => this.lnkLogoutClick()}
                  >
                    Logout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  lnkLogoutClick() {
    this.context.setToken("");
    this.context.setCustomer(null);
    this.context.setMycart([]);
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    localStorage.removeItem("mycart");
  }
}

export default withRouter(Menu);
