import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";

class CategoryDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      txtID: "",
      txtName: "",
    };
  }
  render() {
    return (
      // Đã xóa float-right vì khung cha (admin-detail-box) đã dùng Flexbox rồi
      <div>
        <h2 className="admin-section-title">CHI TIẾT DANH MỤC</h2>
        <form>
          {/* Đã thêm class admin-form-table để tự động căn chỉnh input */}
          <table className="admin-form-table">
            <tbody>
              <tr>
                <td>ID Danh mục</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtID}
                    onChange={(e) => {
                      this.setState({ txtID: e.target.value });
                    }}
                    readOnly={true}
                    placeholder="ID tự động sinh khi thêm mới"
                    style={{
                      backgroundColor: "#e9ecef",
                      cursor: "not-allowed",
                    }} // Làm nền xám để biểu thị ô này không được sửa
                  />
                </td>
              </tr>
              <tr>
                <td>Tên danh mục</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtName}
                    onChange={(e) => {
                      this.setState({ txtName: e.target.value });
                    }}
                    placeholder="Nhập tên danh mục..."
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  {/* Bọc 3 nút bấm vào nhóm class admin-button-group để dàn hàng ngang */}
                  <div
                    className="admin-button-group"
                    style={{ justifyContent: "flex-start", marginTop: "20px" }}
                  >
                    <button
                      className="btn-admin btn-add"
                      onClick={(e) => this.btnAddClick(e)}
                    >
                      THÊM MỚI
                    </button>
                    <button
                      className="btn-admin btn-update"
                      onClick={(e) => this.btnUpdateClick(e)}
                    >
                      CẬP NHẬT
                    </button>
                    <button
                      className="btn-admin btn-delete"
                      onClick={(e) => this.btnDeleteClick(e)}
                    >
                      XÓA
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item ? this.props.item._id : "",
        txtName: this.props.item ? this.props.item.name : "",
      });
    }
  }

  apiGetCategories() {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/categories", config).then((res) => {
      const result = res.data;
      this.props.updateCategories(result);
    });
  }

  // event-handlers
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) {
      const cate = { name: name };
      this.apiPostCategory(cate);
    } else {
      alert("Vui lòng nhập tên danh mục!");
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    if (id && name) {
      const cate = { name: name };
      this.apiPutCategory(id, cate);
    } else {
      alert("Vui lòng chọn danh mục và nhập tên mới!");
    }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm("BẠN CÓ CHẮC CHẮN MUỐN XÓA DANH MỤC NÀY?")) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteCategory(id);
      } else {
        alert("Vui lòng chọn một danh mục để xóa!");
      }
    }
  }

  // apis
  apiPostCategory(cate) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.post("/api/admin/categories", cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Thêm mới thành công!");
        this.apiGetCategories();
        this.setState({ txtID: "", txtName: "" }); // Xóa trắng form sau khi thêm
      } else {
        alert("Thêm mới thất bại!");
      }
    });
  }

  apiPutCategory(id, cate) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.put("/api/admin/categories/" + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Cập nhật thành công!");
        this.apiGetCategories();
      } else {
        alert("Cập nhật thất bại!");
      }
    });
  }

  apiDeleteCategory(id) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.delete("/api/admin/categories/" + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert("Xóa thành công!");
        this.apiGetCategories();
        this.setState({ txtID: "", txtName: "" }); // Xóa trắng form sau khi xóa
      } else {
        alert("Xóa thất bại!");
      }
    });
  }
}

export default CategoryDetail;
