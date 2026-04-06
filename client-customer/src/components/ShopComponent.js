import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext";
import "./styles/home.css"; // Tái sử dụng CSS của trang Home

class Shop extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      products: [],
    };
  }

  render() {
    // 1. Render Danh sách Categories thành các nút bấm
    const cates = this.state.categories.map((item) => {
      return (
        <Link
          key={item._id}
          to={"/product/category/" + item._id}
          className="btn btn-cart"
          style={{
            textDecoration: "none",
            textAlign: "center",
            padding: "10px 20px",
          }}
        >
          {item.name}
        </Link>
      );
    });

    // 2. Render Danh sách tất cả Sản phẩm
    const prods = this.state.products.map((item) => {
      return (
        <div key={item._id} className="product-card">
          <div className="product-img">
            <Link to={"/product/" + item._id}>
              <img
                src={"data:image/jpg;base64," + item.image}
                alt={item.name}
              />
            </Link>
          </div>
          <div className="product-info">
            <div className="product-name" title={item.name}>
              {item.name}
            </div>
            <div className="product-price">
              {item.price.toLocaleString()} VND
            </div>
            <div className="product-actions">
              <button
                className="btn btn-cart"
                onClick={() => this.addToCart(item)}
              >
                Thêm vào giỏ
              </button>
              <button className="btn btn-buy" onClick={() => this.buyNow(item)}>
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="home-container">
        {/* Khối 1: Hiển thị các Danh mục */}
        <section style={{ marginTop: "30px", marginBottom: "40px" }}>
          <h2 className="section-title">DANH MỤC SẢN PHẨM</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            {cates}
          </div>
        </section>

        {/* Khối 2: Hiển thị lưới tất cả Sản phẩm */}
        <section>
          <h2 className="section-title">TẤT CẢ SẢN PHẨM</h2>
          {this.state.products.length > 0 ? (
            <div className="product-grid">{prods}</div>
          ) : (
            <p style={{ textAlign: "center", color: "#666" }}>
              Đang tải sản phẩm...
            </p>
          )}
        </section>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
    this.apiGetAllProducts();
  }

  // --- APIS ---
  apiGetCategories() {
    axios.get("/api/customer/categories").then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }

  apiGetAllProducts() {
    // Gọi API lấy TẤT CẢ sản phẩm (thường Backend sẽ có API này)
    axios.get("/api/customer/products").then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }

  // --- XỬ LÝ GIỎ HÀNG ---
  addToCart(product) {
    if (!this.context.token) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      this.props.navigate("/login");
      return;
    }
    const mycart = this.context.mycart;
    const quantity = 1;
    const index = mycart.findIndex((x) => x.product._id === product._id);
    if (index === -1) {
      mycart.push({ product: product, quantity: quantity });
    } else {
      mycart[index].quantity += quantity;
    }
    this.context.setMycart(mycart);
    localStorage.setItem("mycart", JSON.stringify(mycart));
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  buyNow(product) {
    if (!this.context.token) {
      alert("Vui lòng đăng nhập để mua sản phẩm!");
      this.props.navigate("/login");
      return;
    }
    this.props.navigate("/product/" + product._id);
  }
}

export default withRouter(Shop);
