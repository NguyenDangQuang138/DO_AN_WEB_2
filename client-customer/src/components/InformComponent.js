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

      // BỔ SUNG STATE CHO TÌM KIẾM GỢI Ý
      suggestedProducts: [],
      showSuggestions: false,
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

        {/* 2. Search Form (Nằm ở giữa) - ĐÃ BỔ SUNG DROPDOWN GỢI Ý */}
        <div
          style={{
            position: "relative",
            flex: 1,
            margin: "0 20px",
            maxWidth: "600px",
          }}
        >
          <form className="search" style={{ margin: 0, display: "flex" }}>
            <input
              type="search"
              placeholder="Nhập tên sản phẩm cần tìm..."
              className="keyword"
              value={this.state.txtKeyword}
              onChange={(e) => this.handleSearchChange(e)} // Đổi sang hàm mới
              onBlur={() => {
                // Đóng khung gợi ý khi click ra ngoài (delay 200ms để kịp nhận sự kiện click vào sản phẩm)
                setTimeout(
                  () => this.setState({ showSuggestions: false }),
                  200,
                );
              }}
              onFocus={() => {
                if (this.state.txtKeyword.trim() !== "")
                  this.setState({ showSuggestions: true });
              }}
              style={{ width: "100%" }}
            />
            <input
              type="submit"
              value="SEARCH"
              className="button-search"
              onClick={(e) => this.btnSearchClick(e)}
            />
          </form>

          {/* BẢNG DROPDOWN HIỂN THỊ SẢN PHẨM GỢI Ý */}
          {this.state.showSuggestions &&
            this.state.suggestedProducts.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: "90px", // Chừa lại phần của nút SEARCH
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 1000,
                  maxHeight: "350px",
                  overflowY: "auto",
                }}
              >
                {this.state.suggestedProducts.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => this.goToProductDetail(item._id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 15px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f9f9f9")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fff")
                    }
                  >
                    <img
                      src={"data:image/jpg;base64," + item.image}
                      alt={item.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        marginRight: "15px",
                      }}
                    />
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#333",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#e55a25",
                          fontWeight: "bold",
                        }}
                      >
                        {item.price.toLocaleString()} đ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* 3. Giỏ hàng (Nằm bên phải) */}
        <div
          className="inform-cart-section"
          style={{ display: "flex", alignItems: "center", marginRight: "20px" }}
        >
          <div
            onClick={() => this.lnkMyCartClick()}
            style={{
              cursor: "pointer",
              position: "relative",
              display: "inline-block",
              color: "#e55a25",
              transition: "transform 0.2s",
            }}
            title="Xem giỏ hàng của bạn"
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>

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
                border: "2px solid #000",
              }}
            >
              {this.context.mycart.length}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- EVENT HANDLERS ---

  // Xử lý khi người dùng gõ phím vào ô tìm kiếm
  handleSearchChange(e) {
    const keyword = e.target.value;
    this.setState({ txtKeyword: keyword });

    if (keyword.trim() !== "") {
      this.setState({ showSuggestions: true });
      this.apiSuggestProducts(keyword); // Gọi API lấy sản phẩm gợi ý
    } else {
      this.setState({ suggestedProducts: [], showSuggestions: false });
    }
  }

  // Xử lý khi người dùng ấn nút SEARCH (hoặc Enter)
  btnSearchClick(e) {
    e.preventDefault();
    if (this.state.txtKeyword.trim() !== "") {
      this.setState({ showSuggestions: false }); // Ẩn bảng gợi ý
      this.props.navigate("/product/search/" + this.state.txtKeyword);
    }
  }

  // Xử lý khi người dùng bấm trực tiếp vào 1 sản phẩm trong bảng gợi ý
  goToProductDetail(id) {
    this.setState({ showSuggestions: false, txtKeyword: "" }); // Reset thanh tìm kiếm
    this.props.navigate("/product/" + id);
  }

  lnkMyCartClick() {
    if (!this.context.token) {
      alert("Vui lòng đăng nhập để xem giỏ hàng!");
      this.props.navigate("/login");
    } else {
      this.props.navigate("/mycart");
    }
  }

  // --- APIS ---

  componentDidMount() {
    this.apiGetCategories();
  }

  apiGetCategories() {
    axios.get("/api/customer/categories").then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }

  // API lấy danh sách sản phẩm gợi ý
  apiSuggestProducts(keyword) {
    axios.get("/api/customer/products/search/" + keyword).then((res) => {
      const result = res.data;
      this.setState({
        // Chỉ cắt lấy 5 sản phẩm đầu tiên để khung gợi ý không bị quá dài
        suggestedProducts: result.slice(0, 5),
      });
    });
  }
}

export default withRouter(Inform);
