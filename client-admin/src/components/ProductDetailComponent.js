import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";
import ReactQuill from "react-quill-new";

class ProductDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: "",
      txtName: "",
      txtPrice: 0,
      cmbCategory: "",
      imgProduct: "",
      txtDetails: "", // 👈 State lưu nội dung mô tả
    };
  }

  render() {
    const cates = this.state.categories.map((cate) => {
      return (
        <option key={cate._id} value={cate._id}>
          {cate.name}
        </option>
      );
    });

    return (
      <div className="admin-detail-box">
        <h2 className="text-center">PRODUCT DETAILS</h2>
        <form>
          <table className="admin-form-table">
            <tbody>
              <tr>
                <td>ID</td>
                <td>
                  <input type="text" value={this.state.txtID} readOnly />
                </td>
              </tr>
              <tr>
                <td>Name</td>
                <td>
                  <input
                    type="text"
                    value={this.state.txtName}
                    onChange={(e) => this.setState({ txtName: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>Price</td>
                <td>
                  <input
                    type="number"
                    value={this.state.txtPrice}
                    onChange={(e) =>
                      this.setState({ txtPrice: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Category</td>
                <td>
                  <select
                    value={this.state.cmbCategory}
                    onChange={(e) =>
                      this.setState({ cmbCategory: e.target.value })
                    }
                  >
                    <option value="">-- Choose --</option>
                    {cates}
                  </select>
                </td>
              </tr>
              <tr>
                <td>Image</td>
                <td>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => this.previewImage(e)}
                  />
                </td>
              </tr>
              <tr>
                <td>Content</td>
                <td>
                  <ReactQuill
                    theme="snow"
                    className="quill-editor"
                    value={this.state.txtDetails}
                    onChange={(value) => this.setState({ txtDetails: value })}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <div className="admin-button-group">
                    <button
                      className="btn-admin btn-add"
                      onClick={(e) => this.btnAddClick(e)}
                    >
                      ADD NEW
                    </button>
                    <button
                      className="btn-admin btn-update"
                      onClick={(e) => this.btnUpdateClick(e)}
                    >
                      UPDATE
                    </button>
                    <button
                      className="btn-admin btn-delete"
                      onClick={(e) => this.btnDeleteClick(e)}
                    >
                      DELETE
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

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      if (this.props.item) {
        this.setState({
          txtID: this.props.item._id || "",
          txtName: this.props.item.name || "",
          txtPrice: this.props.item.price || 0,
          cmbCategory: this.props.item.category?._id || "",
          txtDetails: this.props.item.details || "", // 👈 Load details
          imgProduct: this.props.item.image
            ? "data:image/jpg;base64," + this.props.item.image
            : "",
        });
      } else {
        this.setState({
          txtID: "",
          txtName: "",
          txtPrice: 0,
          cmbCategory: "",
          imgProduct: "",
          txtDetails: "",
        });
      }
    }
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => this.setState({ imgProduct: evt.target.result });
      reader.readAsDataURL(file);
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const { txtName, txtPrice, cmbCategory, imgProduct, txtDetails } =
      this.state;
    const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, "");
    if (txtName && txtPrice && cmbCategory && image) {
      const prod = {
        name: txtName,
        price: parseInt(txtPrice),
        category: cmbCategory,
        image: image,
        details: txtDetails,
      };
      this.apiPostProduct(prod);
    } else {
      alert("Vui lòng nhập đầy đủ thông tin cơ bản!");
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID, txtName, txtPrice, cmbCategory, imgProduct, txtDetails } =
      this.state;
    const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, "");
    if (txtID && txtName && txtPrice && cmbCategory && image) {
      const prod = {
        name: txtName,
        price: parseInt(txtPrice),
        category: cmbCategory,
        image: image,
        details: txtDetails,
      };
      this.apiPutProduct(txtID, prod);
    } else {
      alert("Vui lòng chọn sản phẩm để cập nhật!");
    }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm("ARE YOU SURE ?")) {
      if (this.state.txtID) this.apiDeleteProduct(this.state.txtID);
    }
  }

  apiGetCategories() {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.get("/api/admin/categories", config).then((res) => {
      this.setState({ categories: res.data });
    });
  }

  apiPostProduct(prod) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.post("/api/admin/products", prod, config).then((res) => {
      if (res.data) {
        alert("SUCCESS!");
        this.apiGetProducts();
      } else alert("FAIL!");
    });
  }

  apiPutProduct(id, prod) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.put("/api/admin/products/" + id, prod, config).then((res) => {
      if (res.data) {
        alert("SUCCESS!");
        this.apiGetProducts();
      } else alert("FAIL!");
    });
  }

  apiDeleteProduct(id) {
    const config = { headers: { "x-access-token": this.context.token } };
    axios.delete("/api/admin/products/" + id, config).then((res) => {
      if (res.data) {
        alert("DELETED!");
        this.apiGetProducts();
      } else alert("FAIL!");
    });
  }

  apiGetProducts() {
    const config = { headers: { "x-access-token": this.context.token } };
    axios
      .get("/api/admin/products?page=" + this.props.curPage, config)
      .then((res) => {
        const result = res.data;
        this.props.updateProducts(result.products, result.noPages);
      });
  }
}
export default ProductDetail;
