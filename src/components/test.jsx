import React, { Component } from "react";
import { drizzleConnect } from "drizzle-react";

import PropTypes from "prop-types";

class Test extends Component {
  constructor(props, context) {
    super(props);
    this.contracts = context.drizzle.contracts;
    console.log(this.props.accounts[0]);
    this.dataKey = this.contracts.SKUToken.methods.getAccessLevelOfUser.cacheCall(
      ...Object.values([1]),
      { from: this.props.accounts[0] }
    );
  }
  render() {
    // If the data isn't here yet, show loading
    if (!(this.dataKey in this.props.SKUToken.getAccessLevelOfUser)) {
      return <span>Loading...</span>;
    }

    // If the data is here, get it and display it
    var data = this.props.SKUToken.getAccessLevelOfUser[this.dataKey].value;

    return <div>{data}</div>;
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
