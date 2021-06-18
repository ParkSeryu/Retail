import React, { Component } from "react";
import AppBars from "../components/AppBars";
import { withRouter } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div>
        <AppBars programName={window.sessionStorage.getItem("branch_name")} />
      </div>
    );
  }
}

export default withRouter(Home);
