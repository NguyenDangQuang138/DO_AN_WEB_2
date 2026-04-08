import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import ProductDetail from "./ProductDetailComponent";

class Product extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null,
      keyword: "", // Thêm state để lưu từ khóa tìm kiếm
    };
  }
  render() {
    // TÍNH NĂNG 1: LỌC SẢN PHẨM THEO TỪ KHÓA TÌM KIẾM
    const filteredProducts = this.state.products.filter((item) =>
      item.name.toLowerCase().includes(this.state.keyword.toLowerCase()),
    );

    const prods = filteredProducts.map((item) => {
      return (
        <tr
          key={item._id}
          // Thêm class selected để biết dòng nào đang được bấm
          className={`datatable-row ${this.state.itemSelected?._id === item._id ? "selected" : ""}`}
          onClick={() => this.trItemClick(item)}
        >
          <td>
            <b>{item._id.substring(item._id.length - 6)}</b>
          </td>{" "}
          {/* Cắt ID cho gọn */}
          <td>{item.name}</td>
          <td style={{ color: "#e55a25", fontWeight: "bold" }}>
            {item.price.toLocaleString()} đ
          </td>
          <td>{new Date(item.cdate).toLocaleDateString("vi-VN")}</td>
          <td>{item.category?.name}</td>
          <td>
            <img
              src={"data:image/jpg;base64," + item.image}
              width="60px"
              height="60px"
              alt={item.name}
              style={{ borderRadius: "5px", objectFit: "cover" }}
            />
          </td>
        </tr>
      );
    });

    // TÍNH NĂNG 2: LÀM ĐẸP NÚT PHÂN TRANG (PAGINATION)
    const pagination = Array.from(
      { length: this.state.noPages },
      (_, index) => {
        const isActive = index + 1 === this.state.curPage;
        return (
          <button
            key={index}
            className={`page-btn ${isActive ? "active" : ""}`}
            onClick={() => this.lnkPageClick(index + 1)}
          >
            {index + 1}
          </button>
        );
      },
    );

    return (
      // Dùng admin-container để chuẩn form Flexbox
      <div className="admin-container">
        {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
        <div className="admin-list-box">
          <h2 className="admin-section-title">QUẢN LÝ SẢN PHẨM</h2>

          {/* THANH TÌM KIẾM */}
          <div className="admin-search-box">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Nhập tên sản phẩm để tìm kiếm nhanh..."
              value={this.state.keyword}
              onChange={(e) => this.setState({ keyword: e.target.value })}
            />
          </div>

          <div className="table-scroll-wrapper" style={{ maxHeight: "55vh" }}>
            <table className="admin-datatable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Ngày tạo</th>
                  <th>Danh mục</th>
                  <th>Ảnh</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  prods
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Không tìm thấy sản phẩm nào!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* KHU VỰC CHỨA NÚT PHÂN TRANG */}
          <div className="admin-pagination">{pagination}</div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT SẢN PHẨM (Form + Editor) */}
        <div className="admin-detail-box">
          <ProductDetail
            item={this.state.itemSelected}
            curPage={this.state.curPage}
            updateProducts={this.updateProducts}
          />
        </div>
      </div>
    );
  }

  updateProducts = (products, noPages, curPage) => {
    this.setState({ products: products, noPages: noPages, curPage: curPage });
  };

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  lnkPageClick(index) {
    this.apiGetProducts(index);
    this.setState({ keyword: "" }); // Reset từ khóa khi chuyển trang
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  apiGetProducts(page) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/products?page=" + page, config).then((res) => {
      const result = res.data;
      this.setState({
        products: result.products,
        noPages: result.noPages,
        curPage: result.curPage,
      });
    });
  }
}

export default Product;
