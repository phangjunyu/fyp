import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";

class EditACL extends Component {
  constructor(props, context) {
    super(props);
    this.contract = context.drizzle.contracts.SKUToken;
  }
  render() {
    console.log(this.props);
    return (
      <h2>
        HELLO WORLD {this.props.permission} {this.props.tokenId}
      </h2>
    );
  }
}

EditACL.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    SKUToken: state.contracts.SKUToken,
    drizzleStatus: state.drizzleStatus
  };
};

export default drizzleConnect(EditACL, mapStateToProps);
