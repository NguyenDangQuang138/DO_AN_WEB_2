import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";
import MyContext from "../contexts/MyContext";
//

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
      similarProducts: [],
    };
  }

  render() {
    const prod = this.state.product;

    const similarProds = this.state.similarProducts.map((item) => {
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
                onClick={() => this.addSimilarToCart(item)}
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      );
    });

    if (prod != null) {
      return (
        <div className="home-container">
          {/* PHẦN 1: THÔNG TIN CƠ BẢN (ẢNH, GIÁ, NÚT MUA) */}
          <div className="align-center" style={{ marginBottom: "50px" }}>
            <h2 className="section-title">PRODUCT DETAILS</h2>
            <figure
              className="caption-right"
              style={{ gap: "30px", justifyContent: "center" }}
            >
              <img
                src={"data:image/jpg;base64," + prod.image}
                width="400px"
                height="400px"
                alt={prod.name}
                style={{
                  objectFit: "contain",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              />
              <figcaption>
                <form>
                  <table style={{ fontSize: "16px", lineHeight: "2" }}>
                    <tbody>
                      <tr>
                        <td
                          align="right"
                          style={{ fontWeight: "bold", paddingRight: "15px" }}
                        >
                          Name:
                        </td>
                        <td>{prod.name}</td>
                      </tr>
                      <tr>
                        <td
                          align="right"
                          style={{ fontWeight: "bold", paddingRight: "15px" }}
                        >
                          Price:
                        </td>
                        <td style={{ color: "#ff6b35", fontWeight: "bold" }}>
                          {prod.price.toLocaleString()} VND
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="right"
                          style={{ fontWeight: "bold", paddingRight: "15px" }}
                        >
                          Category:
                        </td>
                        <td>{prod.category.name}</td>
                      </tr>
                      <tr>
                        <td
                          align="right"
                          style={{ fontWeight: "bold", paddingRight: "15px" }}
                        >
                          Quantity:
                        </td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={this.state.txtQuantity}
                            onChange={(e) =>
                              this.setState({ txtQuantity: e.target.value })
                            }
                            style={{
                              padding: "5px",
                              width: "60px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td style={{ paddingTop: "15px" }}>
                          <input
                            type="submit"
                            value="Thêm vào giỏ"
                            onClick={(e) => this.btnAdd2CartClick(e)}
                            style={{ width: "auto", padding: "10px 20px" }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </figcaption>
            </figure>
          </div>

          {/* ========================================================
              PHẦN 1.2: MÔ TẢ CHI TIẾT SẢN PHẨM (MỚI THÊM)
              ======================================================== */}
          <div
            className="product-content-wrapper"
            style={{
              maxWidth: "1150px",
              margin: "0 auto 50px auto",
              padding: "20px",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                borderBottom: "2px solid #e55a25",
                paddingBottom: "10px",
                color: "#333",
                textTransform: "uppercase",
                fontSize: "18px",
                marginBottom: "20px",
              }}
            >
              Thông tin chi tiết sản phẩm
            </h3>
            <div
              className="product-content-body"
              style={{ lineHeight: "1.8", fontSize: "16px", color: "#444" }}
              dangerouslySetInnerHTML={{
                __html:
                  prod.details ||
                  "<p style='color:#888; text-align:center;'>Sản phẩm này hiện chưa có mô tả chi tiết từ quản trị viên.</p>",
              }}
            />
          </div>

          {/* PHẦN 2: SẢN PHẨM TƯƠNG TỰ */}
          {this.state.similarProducts.length > 0 && (
            <section
              style={{
                borderTop: "1px solid #eee",
                paddingTop: "30px",
                paddingBottom: "50px",
              }}
            >
              <h2 className="section-title">SẢN PHẨM CÙNG DANH MỤC</h2>
              <div className="product-grid">{similarProds}</div>
            </section>
          )}
        </div>
      );
    }
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Đang tải chi tiết sản phẩm...
      </div>
    );
  }

  // --- LOGIC HÀM (GIỮ NGUYÊN NHƯ CŨ) ---
  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.id !== prevProps.params.id) {
      this.apiGetProduct(params.id);
      this.setState({ txtQuantity: 1 });
      window.scrollTo(0, 0);
    }
  }

  btnAdd2CartClick(e) {
    e.preventDefault();
    if (!this.context.token) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      this.props.navigate("/login");
      return;
    }
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity);
    if (quantity) {
      const mycart = this.context.mycart;
      const index = mycart.findIndex((x) => x.product._id === product._id);
      if (index === -1) {
        mycart.push({ product: product, quantity: quantity });
      } else {
        mycart[index].quantity += quantity;
      }
      this.context.setMycart(mycart);
      localStorage.setItem("mycart", JSON.stringify(mycart));
      this.apiUpdateCart(mycart);
      alert(`Đã thêm ${quantity} x "${product.name}" vào giỏ hàng!`);
    }
  }

  addSimilarToCart(product) {
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
    this.apiUpdateCart(mycart);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  apiUpdateCart(mycart) {
    if (this.context.customer) {
      const body = { customerId: this.context.customer._id, cart: mycart };
      axios.put("/api/customer/cart", body).then((res) => {
        console.log("Cập nhật DB thành công!");
      });
    }
  }

  apiGetProduct(id) {
    axios.get("/api/customer/products/" + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
      if (result && result.category) {
        this.apiGetSimilarProducts(result.category._id, result._id);
      }
    });
  }

  apiGetSimilarProducts(cid, currentProductId) {
    axios.get("/api/customer/products/category/" + cid).then((res) => {
      const result = res.data;
      const similar = result.filter((item) => item._id !== currentProductId);
      this.setState({ similarProducts: similar });
    });
  }
}

export default withRouter(ProductDetail);
