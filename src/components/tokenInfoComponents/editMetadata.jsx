import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import { Input } from "antd";
const { Search } = Input;
class EditMetadata extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
    this.contract = context.drizzle.contracts.SKUToken;
  }

  handleInputChange = event => {
    let value = event.target.value;
    this.setState({ [event.target.name]: value });
  };

  handleSearch = () => {
    const method = this.contract.methods.setURI;
    method.cacheSend(...[this.state._uri, this.props.searchTokenId], {
      from: this.props.account
    });
    const inputs = Object.keys(this.state);
    const freshState = inputs.reduce((res, input) => {
      // TODO better way to clear booleans...?
      if (typeof this.state[input] === "boolean") {
        return res;
      }
      res[input] = "";
      return res;
    }, {});
    this.setState(freshState);
  };

  render() {
    return (
      <Search
        name="_uri"
        placeholder="Enter new IPFS Hash"
        enterButton="Update"
        size="large"
        onChange={this.handleInputChange}
        onSearch={this.handleSearch}
      />
    );
  }
}

EditMetadata.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    SKUToken: state.contracts.SKUToken,
    drizzleStatus: state.drizzleStatus
  };
};

export default drizzleConnect(EditMetadata, mapStateToProps);
