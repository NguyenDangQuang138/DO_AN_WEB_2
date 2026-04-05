import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import MyContext from "../contexts/MyContext";
import withRouter from "../utils/withRouter";
import "./styles/home.css";

class Home extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
      news: [],
    };
  }

  render() {
    // 1. Render New Products (Thêm bước lọc bỏ item null/thiếu ảnh)
    const newprods = this.state.newprods
      .filter((item) => item && item.image) // Chỉ lấy sản phẩm hợp lệ
      .map((item) => {
        return (
          <div key={item._id} className="product-card">
            <Link to={"/product/" + item._id}>
              <div className="product-img">
                <img
                  src={"data:image/jpg;base64," + item.image}
                  alt={item.name}
                />
              </div>
            </Link>
            <div className="product-info">
              <p className="product-name">{item.name}</p>
              <p className="product-price">{item.price} VND</p>
              <div className="product-actions">
                <button
                  className="btn btn-cart"
                  onClick={() => this.addToCart(item)}
                >
                  Thêm vào giỏ
                </button>
                <button
                  className="btn btn-buy"
                  onClick={() => this.buyNow(item)}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        );
      });

    // 2. Render Hot Products (Tương tự, kiểm tra dữ liệu kỹ càng)
    const hotprods = this.state.hotprods
      .filter((item) => item && item.image)
      .map((item) => {
        return (
          <div key={item._id} className="product-card">
            <Link to={"/product/" + item._id}>
              <div className="product-img">
                <img
                  src={"data:image/jpg;base64," + item.image}
                  alt={item.name}
                />
              </div>
            </Link>
            <div className="product-info">
              <p className="product-name">{item.name}</p>
              <p className="product-price">{item.price} VND</p>
              <div className="product-actions">
                <button
                  className="btn btn-cart"
                  onClick={() => this.addToCart(item)}
                >
                  Thêm vào giỏ
                </button>
                <button
                  className="btn btn-buy"
                  onClick={() => this.buyNow(item)}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        );
      });

    // 3. Render News
    const newsList = this.state.news
      .filter((item) => item && item.image)
      .map((item) => {
        return (
          <div key={item._id} className="news-card">
            <Link to={"/news/" + item._id} style={{ textDecoration: "none" }}>
              <div className="news-img-wrapper">
                <img
                  src={"data:image/jpg;base64," + item.image}
                  alt={item.title}
                />
              </div>
              <h3 className="news-title" title={item.title}>
                {item.title}
              </h3>
            </Link>
          </div>
        );
      });

    return (
      <div className="home-container">
        <div className="hero-banner">
          <img
            src="/image/snapedit_1775132700102.jpeg"
            alt="Nâng cấp trải nghiệm gaming của bạn"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
            }}
          />
        </div>

        {/* NEW PRODUCTS */}
        <section>
          <h2 className="section-title">NEW PRODUCTS</h2>
          <div className="product-grid">
            {newprods.length > 0 ? (
              newprods
            ) : (
              <p className="text-center">Đang cập nhật sản phẩm mới...</p>
            )}
          </div>
        </section>

        {/* HOT PRODUCTS */}
        {hotprods.length > 0 && (
          <section>
            <h2 className="section-title">HOT PRODUCTS</h2>
            <div className="product-grid">{hotprods}</div>
          </section>
        )}

        {/* TIN TỨC CÔNG NGHỆ */}
        {newsList.length > 0 && (
          <section
            className="news-section"
            style={{ marginTop: "50px", marginBottom: "40px" }}
          >
            <div className="news-header">
              <h2 style={{ fontSize: "22px", color: "#333", margin: 0 }}>
                Tin tức công nghệ
              </h2>
              <Link to="/news" className="view-all-link">
                Xem tất cả
              </Link>
            </div>
            <div className="news-grid">{newsList}</div>
          </section>
        )}

        {/* ABOUT US */}
        <section>
          <h2 className="section-title">ABOUT US</h2>

          <div className="about-us">
            <p>
              Chúng tôi là cửa hàng trực tuyến chuyên cung cấp linh kiện và phụ
              kiện máy tính như CPU, GPU, RAM, ổ cứng và các thiết bị ngoại vi.
            </p>

            <p>
              Sản phẩm được chọn lọc từ các thương hiệu uy tín, đảm bảo chất
              lượng, hiệu năng và giá cả hợp lý.
            </p>

            <p>
              Chúng tôi luôn đồng hành cùng bạn trong việc xây dựng và nâng cấp
              hệ thống máy tính một cách dễ dàng và hiệu quả.
            </p>

            <p>
              <strong>Uy tín – Chất lượng – Tận tâm</strong>
            </p>
          </div>
        </section>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
    this.apiGetNews();
  }

  addToCart(product) {
    if (!this.context.token) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      this.props.navigate("/login");
      return;
    }
    const mycart = this.context.mycart;
    const index = mycart.findIndex((x) => x.product._id === product._id);
    if (index === -1) {
      mycart.push({ product: product, quantity: 1 });
    } else {
      mycart[index].quantity += 1;
    }
    this.context.setMycart(mycart);
    localStorage.setItem("mycart", JSON.stringify(mycart));
    this.apiUpdateCart(mycart);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  buyNow(product) {
    if (!this.context.token) {
      alert("Vui lòng đăng nhập để mua sản phẩm!");
      this.props.navigate("/login");
      return;
    }
    alert(`Mua ngay sản phẩm: "${product.name}" - Giá: ${product.price} VND`);
  }

  apiUpdateCart(mycart) {
    if (this.context.customer) {
      const body = { customerId: this.context.customer._id, cart: mycart };
      axios
        .put("/api/customer/cart", body)
        .catch((err) => console.error("Lỗi lưu giỏ hàng: ", err));
    }
  }

  apiGetNewProducts() {
    axios.get("/api/customer/products/new").then((res) => {
      this.setState({ newprods: Array.isArray(res.data) ? res.data : [] });
    });
  }

  apiGetHotProducts() {
    axios.get("/api/customer/products/hot").then((res) => {
      this.setState({ hotprods: Array.isArray(res.data) ? res.data : [] });
    });
  }

  apiGetNews() {
    axios.get("/api/customer/news").then((res) => {
      const result = res.data;
      this.setState({ news: Array.isArray(result) ? result.slice(0, 4) : [] });
    });
  }
}

export default withRouter(Home);
