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
  }
  handleInputChange = event => {
    let value = event.target.value;
    this.setState({ [event.target.name]: value });
  };

  handleSearch = event => {
    console.log("Search ", event);
    const method = this.contract.methods.getAccessLevelOfUser;
    // Declare this call to be cached and synchronized. We'll receive the store key for recall.
    const dataKey = method.cacheCall(this.state["searchTokenId"], {
      from: this.props.account
    });
    this.setState({ dataKey });
  };

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  render() {
    if (!(this.state["dataKey"] in this.props.SKUToken.getAccessLevelOfUser)) {
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
            <Card>Loading...</Card>
          </Card>
        </div>
      );
    }
    var permission = this.props.SKUToken.getAccessLevelOfUser[
      this.state["dataKey"]
    ].value;
    return (
      <div style={{ background: "#FFFFFF", padding: "30px" }}>
        <Card>
          <h3>{permission}</h3>
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
