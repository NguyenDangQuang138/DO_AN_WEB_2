import axios from "axios";
import React, { Component } from "react";
import withRouter from "../utils/withRouter";

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtEmail: "",
      txtOTP: "",
    };
  }

  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">ACTIVE ACCOUNT</h2>

        <form>
          <table className="align-center">
            <tbody>
              <tr>
                <td>Email</td>
                <td>
                  <input
                    type="email"
                    value={this.state.txtEmail}
                    onChange={(e) => {
                      this.setState({ txtEmail: e.target.value });
                    }}
                  />
                </td>
              </tr>

              <tr>
                <td>OTP Code</td>
                <td>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={this.state.txtOTP}
                    onChange={(e) => {
                      this.setState({ txtOTP: e.target.value });
                    }}
                  />
                </td>
              </tr>

              <tr>
                <td></td>
                <td>
                  <input
                    type="submit"
                    value="ACTIVE"
                    onClick={(e) => this.btnActiveClick(e)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  btnActiveClick(e) {
    e.preventDefault();

    const email = this.state.txtEmail;
    const otp = this.state.txtOTP;

    if (email && otp) {
      this.apiActive(email, otp);
    } else {
      alert("Please input email and OTP code");
    }
  }

  apiActive(email, otp) {
    const body = { email: email, otp: otp };

    axios.post("/api/customer/active", body).then((res) => {
      const result = res.data;

      if (result.success) {
        alert("Account activated successfully!");
        this.props.navigate("/login");
      } else {
        alert("Activation failed: " + result.message);
      }
    });
  }
}

export default withRouter(Active);
