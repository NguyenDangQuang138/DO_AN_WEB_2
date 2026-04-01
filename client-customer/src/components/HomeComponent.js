import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./home.css";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
    };
  }

  render() {
    const newprods = this.state.newprods.map((item) => {
      return (
        <div key={item._id} className="product-card">
          <Link to={"/product/" + item._id}>
            <div className="product-img">
              <img src={"data:image/jpg;base64," + item.image} alt="" />
            </div>
          </Link>
          <div className="product-info">
            <p className="product-name">{item.name}</p>
            <p className="product-price">{item.price} VND</p>
          </div>
        </div>
      );
    });

    const hotprods = this.state.hotprods.map((item) => {
      return (
        <div key={item._id} className="product-card">
          <div className="product-img">
            <img src={"data:image/jpg;base64," + item.image} alt="" />
          </div>
          <div className="product-info">
            <p className="product-name">{item.name}</p>
            <p className="product-price">{item.price} VND</p>
          </div>
        </div>
      );
    });

    return (
      <div className="home-container">
        {/* Banner */}
        <div className="hero-banner">
          <h1>MLB STYLE COLLECTION</h1>
        </div>

        {/* NEW PRODUCTS */}
        <section>
          <h2 className="section-title">NEW PRODUCTS</h2>
          <div className="product-grid">{newprods}</div>
        </section>

        {/* HOT PRODUCTS */}
        {this.state.hotprods.length > 0 && (
          <section>
            <h2 className="section-title">HOT PRODUCTS</h2>
            <div className="product-grid">{hotprods}</div>
          </section>
        )}
      </div>
    );
  }
  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  // apis
  apiGetNewProducts() {
    axios.get("/api/customer/products/new").then((res) => {
      const result = res.data;
      this.setState({ newprods: result });
    });
  }

  apiGetHotProducts() {
    axios.get("/api/customer/products/hot").then((res) => {
      const result = res.data;
      this.setState({ hotprods: result });
    });
  }
}

export default Home;
