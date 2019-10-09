import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";

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
    this.setState({
      vara: "new variable a"
    });
    console.log("Random", this);
    this.anotherFunction();
  };

  anotherFunction = () => {
    console.log("another", this);
  };

  render() {
    console.log("var a", this.state.vara);
    return (
      <div>
        <h5>{this.state.vara}</h5>
        <button onClick={this.randomFunction}>click this</button>
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
