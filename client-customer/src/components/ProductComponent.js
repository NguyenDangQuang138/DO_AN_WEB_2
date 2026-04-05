import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext"; // BỔ SUNG: Import Context để xài giỏ hàng

class Product extends Component {
  static contextType = MyContext; // BỔ SUNG: Kết nối với giỏ hàng toàn cục

  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  render() {
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
            <div className="product-price">Price: {item.price}</div>

            <div className="product-actions">
              {/* BỔ SUNG: Gắn sự kiện onClick gọi hàm addToCart */}
              <button
                className="btn btn-cart"
                onClick={() => this.addToCart(item)}
              >
                Add to cart
              </button>
              <button className="btn btn-buy" onClick={() => this.buyNow(item)}>
                Buy now
              </button>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="home-container">
        <h2 className="section-title">LIST PRODUCTS</h2>
        <div className="product-grid">{prods}</div>
      </div>
    );
  }

  componentDidMount() {
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  // ==========================================
  // BỔ SUNG CÁC HÀM XỬ LÝ GIỎ HÀNG (BƯỚC 4)
  // ==========================================

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
      const newItem = { product: product, quantity: quantity };
      mycart.push(newItem);
    } else {
      mycart[index].quantity += quantity;
    }

    this.context.setMycart(mycart);
    localStorage.setItem("mycart", JSON.stringify(mycart));

    // GỌI ĐƯỜNG DÂY NÓNG: Báo Server cất hàng vào Database
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

  // Hàm gọi API cập nhật Database (Cái mà bạn bị khựng ở Bước 4 đây nè)
  apiUpdateCart(mycart) {
    if (this.context.customer) {
      const body = {
        customerId: this.context.customer._id,
        cart: mycart,
      };
      axios
        .put("/api/customer/cart", body)
        .then((res) => {
          console.log("Phản hồi từ Server:", res.data.message);
        })
        .catch((err) => {
          console.error("Lỗi khi lưu giỏ hàng: ", err);
        });
    }
  }

  // --- apis ---
  apiGetProductsByKeyword(keyword) {
    axios.get("/api/customer/products/search/" + keyword).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }

  apiGetProductsByCatID(cid) {
    axios.get("/api/customer/products/category/" + cid).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }
}

export default withRouter(Product);
