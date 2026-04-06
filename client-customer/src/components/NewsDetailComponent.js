import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom"; // Thêm Link để bọc sản phẩm
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext"; // Thêm Context để xử lý giỏ hàng
// // Tái sử dụng CSS lưới sản phẩm của trang chủ

class NewsDetail extends Component {
  static contextType = MyContext; // Khai báo Context

  constructor(props) {
    super(props);
    this.state = {
      newsItem: null,
      suggestedProducts: [], // Mảng chứa sản phẩm gợi ý
    };
  }

  render() {
    const item = this.state.newsItem;

    // 1. Tạo lưới sản phẩm gợi ý (Giống hệt bên ProductDetail)
    const suggestedProds = this.state.suggestedProducts.map((prod) => {
      return (
        <div key={prod._id} className="product-card">
          <div className="product-img">
            <Link to={"/product/" + prod._id}>
              <img
                src={"data:image/jpg;base64," + prod.image}
                alt={prod.name}
              />
            </Link>
          </div>
          <div className="product-info">
            <div className="product-name" title={prod.name}>
              {prod.name}
            </div>
            <div className="product-price">{prod.price} VND</div>
            <div className="product-actions">
              <button
                className="btn btn-cart"
                onClick={() => this.addToCart(prod)}
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      );
    });

    if (item != null) {
      return (
        <div
          className="home-container"
          style={{ paddingTop: "20px", paddingBottom: "40px" }}
        >
          {/* KHỐI 1: NỘI DUNG BÀI VIẾT */}
          <div className="news-detail-article-box">
            {item.image && (
              <div className="news-detail-feature-image-wrapper">
                <img
                  src={"data:image/jpg;base64," + item.image}
                  alt={item.title}
                />
              </div>
            )}
            <h1 className="news-detail-title">{item.title}</h1>
            <p className="news-detail-meta">
              Đăng ngày: {new Date(item.cdate).toLocaleString()}
            </p>
            <div
              className="news-detail-content-body"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>

          {/* KHỐI 2: SẢN PHẨM BẠN CÓ THỂ THÍCH */}
          {this.state.suggestedProducts.length > 0 && (
            <section
              style={{
                marginTop: "50px",
                paddingTop: "30px",
                borderTop: "2px solid #eee",
                maxWidth: "1000px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <h2
                className="section-title"
                style={{ fontSize: "22px", marginBottom: "20px" }}
              >
                SẢN PHẨM BẠN CÓ THỂ THÍCH
              </h2>
              <div className="product-grid">{suggestedProds}</div>
            </section>
          )}
        </div>
      );
    }
    return (
      <div
        style={{ textAlign: "center", padding: "100px 50px", color: "#666" }}
      >
        Đang tải nội dung bài viết...
      </div>
    );
  }

  // --- LIFECYCLE ---
  componentDidMount() {
    const params = this.props.params;
    this.apiGetNewsById(params.id);
    this.apiGetSuggestedProducts(); // Gọi hàm lấy sản phẩm gợi ý
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.id !== prevProps.params.id) {
      this.apiGetNewsById(params.id);
      window.scrollTo(0, 0);
    }
  }

  // --- EVENT HANDLERS ---
  addToCart(product) {
    if (!this.context.token) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
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
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  // --- APIS ---
  apiGetNewsById(id) {
    axios.get("/api/customer/news/" + id).then((res) => {
      const result = res.data;
      this.setState({ newsItem: result });
    });
  }

  apiGetSuggestedProducts() {
    // Gọi API lấy sản phẩm mới nhất làm gợi ý
    axios.get("/api/customer/products/new").then((res) => {
      const result = res.data;
      // Dùng hàm slice(0, 5) để chỉ lấy 5 sản phẩm đầu tiên hiển thị cho đẹp lưới
      this.setState({ suggestedProducts: result.slice(0, 5) });
    });
  }
}

export default withRouter(NewsDetail);
