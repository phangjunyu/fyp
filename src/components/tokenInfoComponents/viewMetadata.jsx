import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import { Spin, Icon, Card } from "antd";
import ipfs from "../ipfs";

class ViewMetadata extends Component {
  constructor(props, context) {
    super(props);
    this.tokenId = this.props.searchTokenId;
    this.state = { currentMetadata: "loading...", [this.tokenId]: "" };
    this.contract = context.drizzle.contracts.SKUToken;
    this.web3 = context.drizzle.web3;

    this.getPastEvents("URI", {
      fromBlock: 0,
      toBlock: "latest"
    });

    this.contract.events["URI"]({
      filter: {
        _id: this.tokenId
      }
    }).on("data", event => {
      const message = `URI for token ID: ${this.tokenId} has been updated to ${event.returnValues._value}!`;
      if (this.state[event.event] === this.tokenId) {
        return;
      } else {
        this.setState({ [event.event]: this.tokenId });
        this.setState({ [this.tokenId]: event.returnValues._value });
        this.retrieveMetadata();
      }
    });
  }

  async getPastEvents(event, options) {
    const yourContractWeb3 = new this.web3.eth.Contract(
      this.contract.abi,
      this.contract.address
    );
    let eventLog = await yourContractWeb3.getPastEvents(event, options);
    this.setState({ [this.tokenId]: eventLog.pop().returnValues._value });
    this.retrieveMetadata();
  }

  retrieveMetadata = () => {
    ipfs.object.data(this.state[this.tokenId], (err, metadata) => {
      if (err) {
        this.setState({ currentMetadata: "invalid Hash!" });
        console.log(err);
        return;
      }
      this.setState({ currentMetadata: metadata.toString() });
    });
  };

  render() {
    const title = `Hash for Token ID ${this.tokenId} is: ${
      this.state[this.tokenId]
    }`;
    const loadingIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    if (this.state.currentMetadata == "loading...") {
      console.log("LOADING HERE");
      return <Spin indicator={loadingIcon} />;
    } else {
      return (
        <Card title={title}>
          <div style={{ textAlign: "left" }}>
            <h4>JSON Metadata:</h4>
            <pre className="prettyprint">
              <code>{this.state.currentMetadata}</code>
            </pre>
          </div>
          <script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"></script>
        </Card>
      );
    }
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
