import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";
// // Dùng chung CSS với trang chủ

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
    };
  }

  render() {
    const newsList = this.state.news.map((item) => {
      return (
        <div
          key={item._id}
          className="news-card"
          style={{
            border: "1px solid #eee",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
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

            {/* Thêm phần tóm tắt cho bài viết */}
            <p
              style={{
                fontSize: "13px",
                color: "#666",
                marginTop: "10px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.summary}
            </p>
          </Link>
        </div>
      );
    });

    return (
      <div className="home-container" style={{ padding: "40px 20px" }}>
        <div
          style={{
            borderBottom: "2px solid #e55a25",
            marginBottom: "30px",
            paddingBottom: "10px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              color: "#333",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            TẤT CẢ TIN TỨC
          </h2>
        </div>

        {this.state.news.length > 0 ? (
          <div className="news-grid">{newsList}</div>
        ) : (
          <p style={{ textAlign: "center", marginTop: "50px", color: "#666" }}>
            Đang tải tin tức...
          </p>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetNews();
  }

  apiGetNews() {
    axios.get("/api/customer/news").then((res) => {
      const result = res.data;
      this.setState({ news: result });
    });
  }
}

export default withRouter(News);
