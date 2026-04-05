import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./styles/footer.css";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="footer-container">
          {/* About Section */}
          <div className="footer-section">
            <h4>About Us</h4>
            <p>
              TECHGEAR GAMING is a leading provider of premium gaming equipment
              and laptops. We're dedicated to enhancing your gaming experience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <Link to="/product/search/new">Sản phẩm</Link>
              </li>
              <li>
                <Link to="/product/search/hot">Tin tức</Link>
              </li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/shipping">Shipping Info</Link>
              </li>
              <li>
                <Link to="/returns">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>
              <strong>Email:</strong> info@techgeargaming.com
            </p>
            <p>
              <strong>Phone:</strong> +84 (0) 123 456 789
            </p>
            <p>
              <strong>Address:</strong> 123 Gaming Street, Tech City, Vietnam
            </p>
          </div>
          <div className="footer-section">
            <Link
              to="/home"
              className="logo-container-footer"
              onClick={() => this.setState({ menuOpen: false })}
            >
              {/* Thay 'logo.png' bằng đường dẫn thực tế hoặc import ảnh của bạn */}
              <img
                src="/image/Gemini_Generated_Image_4kii5o4kii5o4kii.png"
                alt="Logo"
                className="logo-img"
              />
            </Link>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; 2026 TECHGEAR GAMING. All rights reserved.</p>
          <div className="social-links">
            <a href="#facebook" title="Facebook">
              f
            </a>
            <a href="#twitter" title="Twitter">
              𝕏
            </a>
            <a href="#instagram" title="Instagram">
              ⓘ
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
