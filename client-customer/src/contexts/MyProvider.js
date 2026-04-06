import React, { Component } from "react";
import MyContext from "./MyContext";

class MyProvider extends Component {
  constructor(props) {
    super(props);

    const storedToken = localStorage.getItem("customer_token") || "";

    let storedCustomer = null;
    let storedCart = [];
    try {
      const customerData = localStorage.getItem("customer_user");
      if (customerData) storedCustomer = JSON.parse(customerData);

      const cartData = localStorage.getItem("mycart");
      if (cartData) storedCart = JSON.parse(cartData);
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu từ localStorage:", error);
    }

    this.state = {
      // variables
      token: storedToken,
      customer: storedCustomer,
      mycart: storedCart,
      // functions
      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart,
    };
  }

  setMycart = (value) => {
    this.setState({ mycart: value });
  };
  setToken = (value) => {
    this.setState({ token: value });
  };

  setCustomer = (value) => {
    this.setState({ customer: value });
  };

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;
