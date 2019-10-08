import React, { Component } from "react";
import { Card, Input } from "antd";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import BigNumber from "bignumber.js";

const { Search } = Input;
const tabList = [
  {
    key: "tab1",
    tab: "View Information"
  },
  {
    key: "tab2",
    tab: "Update URI"
  },
  {
    key: "tab3",
    tab: "Edit Access Control"
  },
  {
    key: "tab4",
    tab: "Mint Tokens"
  }
];

const contentList = {
  tab1: <Card style={{ minHeight: "25vh" }}>content1</Card>,
  tab2: <Card style={{ minHeight: "25vh" }}>content2</Card>,
  tab3: <Card style={{ minHeight: "25vh" }}>content3</Card>,
  tab4: <Card style={{ minHeight: "25vh" }}>content4</Card>
};

class TokenInfo extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
    this.contract = context.drizzle.contracts.SKUToken;
    const events = this.contract.events;

    events["TransferSingle"]().on("data", event => {
      const tokenId = event.returnValues._id;
      const message =
        event.returnValues._from ===
        "0x0000000000000000000000000000000000000000"
          ? `New Token with ID ${tokenId} has been created by ${event.returnValues._to} with initial supply of ${event.returnValues._value}!`
          : `Transfer of ${event.returnValues._value} worth of Token ${tokenId} from ${event.returnValues._from} to ${event.returnValues._to}`;
      // Catch duplicate events for same transaction
      if (this.state[event.event] === tokenId) {
        return;
      } else {
        this.setState({ [event.event]: tokenId });
        console.log(message);
        window.alert(message);
      }
    });

    events["URI"]().on("data", event => {
      const tokenId = event.returnValues._id;
      const message = `URI for token ID: ${tokenId} has been updated to ${event.returnValues._value}!`;
      // Catch duplicate events for same transaction
      if (this.state[event.event] === tokenId) {
        return;
      } else {
        this.setState({ [event.event]: tokenId });
        console.log(message);
        window.alert(message);
      }
    });
  }
  handleInputChange = event => {
    let value = event.target.value;
    this.setState({ [event.target.name]: value });
  };

  handleSearch = event => {
    console.log("Search ", event);
    const method = this.contract.methods.getAccessLevelOfUser;
    let dataKey = method.cacheCall(BigNumber(this.state["searchTokenId"]), {
      from: this.props.account
    });
    //you should set state here after checking for instance
    // const result = this.props.SKUToken.getAccessLevelOfUser[dataKey].value;
  };

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  render() {
    return (
      <div style={{ background: "#FFFFFF", padding: "30px" }}>
        <Card>
          <Card title="Search Token" bordered={false}>
            <Search
              placeholder="Enter Token ID"
              enterButton
              size="small"
              name="searchTokenId"
              onChange={this.handleInputChange}
              onSearch={this.handleSearch}
            />
          </Card>
          <Card
            style={{ width: "100%" }}
            title="Token Information"
            tabList={tabList}
            // activeTabKey={this.state.key}
            onTabChange={key => {
              this.onTabChange(key, "key");
            }}
          >
            {contentList[this.state.key]}
          </Card>
        </Card>
      </div>
    );
  }
}

TokenInfo.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    SKUToken: state.contracts.SKUToken,
    drizzleStatus: state.drizzleStatus
  };
};

export default drizzleConnect(TokenInfo, mapStateToProps);
