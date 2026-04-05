import "./App.css";
import React, { Component } from "react";
import Main from "./components/MainComponent";
import { BrowserRouter } from "react-router-dom";
import MyProvider from "./contexts/MyProvider";
import Footer from "./components/FooterComponent";

class App extends Component {
  render() {
    return (
      <MyProvider>
        <BrowserRouter>
          <Main />
          <Footer />
        </BrowserRouter>
      </MyProvider>
    );
  }
}

export default App;
