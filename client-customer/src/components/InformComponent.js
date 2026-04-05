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

        {/* 3. Giỏ hàng (Nằm bên phải - ĐÃ THAY BẰNG ICON) */}
        <div
          className="inform-cart-section"
          style={{ display: "flex", alignItems: "center", marginRight: "20px" }}
        >
          <div
            onClick={() => this.lnkMyCartClick()}
            style={{
              cursor: "pointer",
              position:
                "relative" /* Cực kỳ quan trọng để định vị cái bong bóng số lượng */,
              display: "inline-block",
              color: "#e55a25" /* Màu cam chủ đạo */,
              transition: "transform 0.2s",
            }}
            title="Xem giỏ hàng của bạn"
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* Mã SVG vẽ ra chiếc xe đẩy siêu thị */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>

            {/* Bong bóng (Badge) báo số lượng nằm góc trên bên phải icon */}
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-12px",
                background: "#ff6b35",
                color: "white",
                borderRadius: "20px",
                padding: "2px 6px",
                fontSize: "12px",
                fontWeight: "bold",
                border:
                  "2px solid #000" /* Khung viền đen tiệp với màu nền để nổi bật badge */,
              }}
            >
              {this.context.mycart.length}
            </span>
          </div>
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
