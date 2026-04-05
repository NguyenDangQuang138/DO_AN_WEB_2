import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

class News extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      news: [],
      itemSelected: null,
      txtID: "",
      txtTitle: "",
      txtSummary: "",
      txtContent: "",
      imgNews: "",
    };
  }

  render() {
    const newsList = this.state.news.map((item) => {
      return (
        <tr
          key={item._id}
          className="datatable"
          onClick={() => this.trItemClick(item)}
          style={{ cursor: "pointer" }}
        >
          {/* Ép chữ tự xuống dòng nếu quá dài */}
          <td
            style={{
              padding: "10px",
              wordBreak: "break-all",
              minWidth: "80px",
            }}
          >
            {item._id}
          </td>
          <td
            style={{
              padding: "10px",
              wordWrap: "break-word",
              minWidth: "150px",
            }}
          >
            {item.title}
          </td>
          <td style={{ padding: "10px", minWidth: "100px" }}>
            {new Date(item.cdate).toLocaleString()}
          </td>
          <td style={{ padding: "10px", textAlign: "center" }}>
            <img
              src={"data:image/jpg;base64," + item.image}
              width="80px"
              alt=""
              style={{ objectFit: "cover", borderRadius: "4px" }}
            />
          </td>
        </tr>
      );
    });

    return (
      // Dùng Flexbox bọc ngoài để 2 cột luôn nằm cạnh nhau, không bao giờ bị rớt xuống dòng
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          padding: "20px",
          alignItems: "flex-start",
        }}
      >
        {/* CỘT TRÁI: BẢNG DANH SÁCH (Fix cứng chiều rộng 45%, có thanh cuộn) */}
        <div
          style={{
            width: "45%",
            maxHeight:
              "700px" /* Chiều cao tối đa, vượt quá sẽ hiện thanh cuộn dọc */,
            overflowY: "auto" /* Thanh cuộn dọc */,
            overflowX: "auto" /* Thanh cuộn ngang nếu bảng lỡ to quá */,
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2 className="text-center" style={{ marginTop: "0" }}>
            NEWS LIST
          </h2>
          <table
            className="datatable"
            border="1"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <tbody>
              <tr
                className="datatable"
                style={{ position: "sticky", top: "0", zIndex: "1" }}
              >
                {" "}
                {/* Cố định thanh Header của bảng khi cuộn xuống */}
                <th style={{ backgroundColor: "#ffcc00", padding: "10px" }}>
                  ID
                </th>
                <th style={{ backgroundColor: "#ffcc00", padding: "10px" }}>
                  Title
                </th>
                <th style={{ backgroundColor: "#ffcc00", padding: "10px" }}>
                  Date
                </th>
                <th style={{ backgroundColor: "#ffcc00", padding: "10px" }}>
                  Image
                </th>
              </tr>
              {newsList}
            </tbody>
          </table>
        </div>

        {/* CỘT PHẢI: FORM CHI TIẾT (Fix cứng chiều rộng 55%) */}
        <div
          style={{
            width: "55%",
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h2 className="text-center" style={{ marginTop: "0" }}>
            NEWS DETAILS
          </h2>
          <form>
            <table width="100%" style={{ borderSpacing: "0 10px" }}>
              <tbody>
                <tr>
                  <td width="15%" style={{ fontWeight: "bold" }}>
                    ID
                  </td>
                  <td>
                    <input
                      type="text"
                      value={this.state.txtID}
                      readOnly
                      style={{ width: "100%", padding: "8px" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Title</td>
                  <td>
                    <input
                      type="text"
                      value={this.state.txtTitle}
                      onChange={(e) =>
                        this.setState({ txtTitle: e.target.value })
                      }
                      style={{ width: "100%", padding: "8px" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Summary</td>
                  <td>
                    <textarea
                      rows="3"
                      value={this.state.txtSummary}
                      onChange={(e) =>
                        this.setState({ txtSummary: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        resize: "vertical",
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>Image</td>
                  <td>
                    <input
                      type="file"
                      name="fileImage"
                      accept="image/jpeg, image/png, image/gif"
                      onChange={(e) => this.imageUpload(e)}
                    />
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{ fontWeight: "bold", paddingTop: "10px" }}
                  >
                    Content
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan="2"
                    style={{ backgroundColor: "#fff", color: "#000" }}
                  >
                    <ReactQuill
                      theme="snow"
                      value={this.state.txtContent}
                      onChange={(value) => this.setState({ txtContent: value })}
                      style={{ height: "350px", marginBottom: "40px" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" align="center" style={{ paddingTop: "20px" }}>
                    <input
                      type="submit"
                      value="ADD NEW"
                      onClick={(e) => this.btnAddClick(e)}
                      style={{
                        padding: "10px 20px",
                        cursor: "pointer",
                        backgroundColor: "#e55a25",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    />
                    <input
                      type="submit"
                      value="UPDATE"
                      onClick={(e) => this.btnUpdateClick(e)}
                      style={{
                        margin: "0 10px",
                        padding: "10px 20px",
                        cursor: "pointer",
                        backgroundColor: "#333",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    />
                    <input
                      type="submit"
                      value="DELETE"
                      onClick={(e) => this.btnDeleteClick(e)}
                      style={{
                        padding: "10px 20px",
                        cursor: "pointer",
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetNews();
  }

  // --- Event Handlers ---
  trItemClick(item) {
    this.setState({
      itemSelected: item,
      txtID: item._id,
      txtTitle: item.title,
      txtSummary: item.summary,
      txtContent: item.content,
      imgNews: item.image,
    });
  }

  imageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({
          imgNews: evt.target.result.replace(/^data:image\/[a-z]+;base64,/, ""),
        });
      };
      reader.readAsDataURL(file);
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const { txtTitle, txtSummary, txtContent, imgNews } = this.state;
    if (txtTitle && txtSummary && txtContent && imgNews) {
      const news = {
        title: txtTitle,
        summary: txtSummary,
        content: txtContent,
        image: imgNews,
      };
      this.apiPostNews(news);
    } else {
      alert("Vui lòng nhập đầy đủ thông tin và chọn ảnh!");
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID, txtTitle, txtSummary, txtContent, imgNews } = this.state;
    if (txtID && txtTitle && txtSummary && txtContent && imgNews) {
      const news = {
        title: txtTitle,
        summary: txtSummary,
        content: txtContent,
        image: imgNews,
      };
      this.apiPutNews(txtID, news);
    } else {
      alert("Vui lòng chọn bài viết và điền đủ thông tin!");
    }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteNews(id);
      } else {
        alert("Vui lòng chọn bài viết để xóa!");
      }
    }
  }

  // --- APIs ---
  apiGetNews() {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/news", config).then((res) => {
      this.setState({ news: res.data });
    });
  }

  apiPostNews(news) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.post("/api/admin/news", news, config).then((res) => {
      if (res.data) {
        alert("Đăng bài thành công!");
        this.apiGetNews();
      } else {
        alert("Đăng bài thất bại!");
      }
    });
  }

  apiPutNews(id, news) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.put("/api/admin/news/" + id, news, config).then((res) => {
      if (res.data) {
        alert("Cập nhật thành công!");
        this.apiGetNews();
      } else {
        alert("Cập nhật thất bại!");
      }
    });
  }

  apiDeleteNews(id) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.delete("/api/admin/news/" + id, config).then((res) => {
      if (res.data) {
        alert("Đã xóa bài viết!");
        this.apiGetNews();
      } else {
        alert("Xóa thất bại!");
      }
    });
  }
}

export default News;
