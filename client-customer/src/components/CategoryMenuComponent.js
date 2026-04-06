import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// // Trích xuất CSS từ file home.css giống hệt trang Shop

class CategoryMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: [] };
  }

  componentDidMount() {
    axios.get("/api/customer/categories").then((res) => {
      this.setState({ categories: res.data });
    });
  }

  render() {
    // Render Danh sách Categories y hệt như code cũ của bạn
    const cates = this.state.categories.map((item) => {
      return (
        <Link
          key={item._id}
          to={"/product/category/" + item._id}
          className="btn btn-cart" /* Ăn theo class CSS có sẵn của bạn */
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

    // Bọc trong thẻ div với Flexbox y hệt như trang Shop
    return (
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
    );
  }
}

export default CategoryMenu;
