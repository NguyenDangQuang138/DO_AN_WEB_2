import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";

class Inform extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtKeyword: "",
      categories: [],
      menuOpen: false,
    };
  }

  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <Link
          key={item._id}
          to={"/product/category/" + item._id}
          className="category-link"
          onClick={() => this.setState({ menuOpen: false })}
        >
          {item.name}
        </Link>
      );
    });

    return (
      <div className="inform-bar border-bottom">
        {/* 1. Danh mục sản phẩm (Nằm bên trái) */}
        <div
          className="inform-categories-section"
          style={{ position: "relative" }}
        >
          <button
            className="menu-toggle"
            onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}
            aria-label="Toggle menu"
          >
            ☰<span className="menu-label"> Danh mục sản phẩm</span>
          </button>

          {/* Menu Dropdown Panel */}
          {this.state.menuOpen && (
            <div className="menu-panel">
              <h4>Categories</h4>
              <div className="categories-list">{cates}</div>
            </div>
          )}
        </div>

        {/* 2. Search Form (Nằm ở giữa) */}
        <form className="search">
          <input
            type="search"
            placeholder="Enter keyword"
            className="keyword"
            value={this.state.txtKeyword}
            onChange={(e) => {
              this.setState({ txtKeyword: e.target.value });
            }}
          />
          <input
            type="submit"
            value="SEARCH"
            className="button-search"
            onClick={(e) => this.btnSearchClick(e)}
          />
        </form>

        {/* 3. Giỏ hàng (Nằm bên phải) */}
        <div className="inform-cart-section">
          {/* Đã thay đổi thẻ Link thành thẻ span có sự kiện onClick */}
          <span
            onClick={() => this.lnkMyCartClick()}
            style={{
              color: "#e55a25",
              textDecoration: "none",
              marginRight: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            My cart
          </span>
          have <b>{this.context.mycart.length}</b> items
        </div>
      </div>
    );
  }

  // --- event-handlers ---

  btnSearchClick(e) {
    e.preventDefault();
    if (this.state.txtKeyword.trim() !== "") {
      this.props.navigate("/product/search/" + this.state.txtKeyword);
    }
  }

  // Thêm hàm xử lý kiểm tra đăng nhập khi click vào giỏ hàng
  lnkMyCartClick() {
    if (!this.context.token) {
      alert("Vui lòng đăng nhập để xem giỏ hàng!");
      this.props.navigate("/login");
    } else {
      this.props.navigate("/mycart");
    }
  }

  // --- apis ---

  componentDidMount() {
    this.apiGetCategories();
  }

  apiGetCategories() {
    axios.get("/api/customer/categories").then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}

export default withRouter(Inform);
