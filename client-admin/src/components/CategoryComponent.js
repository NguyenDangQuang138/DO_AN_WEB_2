import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import CategoryDetail from "./CategoryDetailComponent";

class Category extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
    };
  }

  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <tr
          key={item._id}
          // Thêm class 'selected' để đổi màu khi click vào dòng
          className={`datatable-row ${this.state.itemSelected?._id === item._id ? "selected" : ""}`}
          onClick={() => this.trItemClick(item)}
        >
          <td>
            <b>{item._id}</b>
          </td>
          <td>{item.name}</td>
        </tr>
      );
    });

    return (
      // Đổi thành admin-container để dùng chung khuôn Flexbox với các trang khác
      <div className="admin-container">
        {/* =======================================================
            CỘT TRÁI: DANH SÁCH DANH MỤC
            ======================================================= */}
        <div className="admin-list-box">
          <h2 className="admin-section-title">QUẢN LÝ DANH MỤC</h2>

          <div className="table-scroll-wrapper">
            <table className="admin-datatable">
              <thead>
                <tr>
                  <th>ID Danh mục</th>
                  <th>Tên danh mục</th>
                </tr>
              </thead>
              <tbody>
                {this.state.categories.length > 0 ? (
                  cates
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">
                      Chưa có danh mục nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =======================================================
            CỘT PHẢI: CHI TIẾT DANH MỤC (Gọi Component con)
            ======================================================= */}
        <div className="admin-detail-box">
          <CategoryDetail
            item={this.state.itemSelected}
            updateCategories={this.updateCategories}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  // event-handlers
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  // apis
  apiGetCategories() {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/categories", config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }

  updateCategories = (categories) => {
    this.setState({ categories: categories });
  };
}

export default Category;
