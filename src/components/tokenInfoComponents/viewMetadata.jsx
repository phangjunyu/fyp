import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";

class ViewMetadata extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
    this.contract = context.drizzle.contracts.SKUToken;
    this.web3 = context.drizzle.web3;

    this.tokenId = this.props.searchTokenId;
    this.getPastEvents("URI", {
      fromBlock: 0,
      toBlock: "latest"
    });
  }

  async getPastEvents(event, options) {
    const yourContractWeb3 = new this.web3.eth.Contract(
      this.contract.abi,
      this.contract.address
    );
    let eventLog = await yourContractWeb3.getPastEvents(event, options);
    this.setState({ [this.tokenId]: eventLog.pop().returnValues._value });
  }

  listenForEvents = () => {
    this.contract.events["URI"]({
      filter: {
        _id: this.tokenId
      },
      fromBlock: "latest"
    }).on("data", event => {
      this.setState({ [this.tokenId]: event.returnValues._value });
    });
  };

  render() {
    return (
      <span>
        URI for Token ID {this.tokenId} is: <br /> {this.state[this.tokenId]}
      </span>
    );
  }
}

ViewMetadata.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    SKUToken: state.contracts.SKUToken,
    drizzleStatus: state.drizzleStatus
  };
};

export default drizzleConnect(ViewMetadata, mapStateToProps);
