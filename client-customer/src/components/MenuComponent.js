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
      isUserMenuOpen: false, // Công tắc mở Dropdown
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
              /* ==========================================
                 1. TRẠNG THÁI CHƯA ĐĂNG NHẬP (GUEST)
                 ========================================== */
              <div
                className="logged-out-user"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* Khối Avatar mặc định cho khách */}
                <div
                  className="user-avatar-wrapper"
                  onClick={() =>
                    this.setState({
                      isUserMenuOpen: !this.state.isUserMenuOpen,
                    })
                  }
                  style={{ cursor: "pointer" }}
                  title="Đăng nhập / Đăng ký"
                >
                  <img
                    src="/image/user.png" /* Link ảnh avatar xám mặc định */
                    alt="Guest"
                    className="user-avatar-img"
                    style={{
                      borderColor: "#888",
                    }}
                  />
                </div>

                {/* Dropdown Login/Signup */}
                <div
                  className={`user-dropdown-menu ${this.state.isUserMenuOpen ? "open" : ""}`}
                >
                  <Link to="/login" className="user-menu-link">
                    Login
                  </Link>
                  <span className="desktop-divider"> | </span>
                  <Link to="/signup" className="user-menu-link">
                    Sign-up
                  </Link>
                </div>
              </div>
            ) : (
              /* ==========================================
                 2. TRẠNG THÁI ĐÃ ĐĂNG NHẬP (USER)
                 ========================================== */
              <div
                className="logged-in-user"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* Khối Avatar thật của User */}
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
                    src="/image/user.png" /* Thay đường dẫn ảnh của bạn vào đây nếu cần */
                    alt="User Logo"
                    className="user-avatar-img"
                  />
                </div>

                {/* Dropdown Menu User */}
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
