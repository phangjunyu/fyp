import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";
import { Switch } from "antd";

import PropTypes from "prop-types";

class Test extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    this.state = {
      vara: "some variable a"
    };
  }

  randomFunction = () => {
    var vara = "nested variable a2";
    this.setState({
      vara
    });
    console.log("Random", this);
  };
  renderRandomFunction = () => {
    return <Switch onChange={this.randomFunction}>click this</Switch>;
  };
  render() {
    console.log("var a", this.state.vara);
    return (
      <div>
        <h5>{this.state.vara}</h5>
        {this.renderRandomFunction()}
      </div>
    );
  }
}

Test.contextTypes = {
  drizzle: PropTypes.object
};
const mapStateToProps = state => {
  return {
    SKUToken: state.contracts.SKUToken,
    accounts: state.accounts
  };
};
export default drizzleConnect(Test, mapStateToProps);
