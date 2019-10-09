import React, { Component } from "react";
import { Card, Input, Tabs, Skeleton, Switch, Icon } from "antd";
import EditACL from "./editACL";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";

const { TabPane } = Tabs;
const { Search } = Input;

class TokenInfo extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      tabs: [false, false, false, false]
    };
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
    this.setState({ loading: true });
  };

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  handleOnLoad = checked => {
    var permission = this.props.SKUToken.getAccessLevelOfUser[
      this.state.dataKey
    ].value;
    this.setState({ permission: permission });
    if (permission == 0) {
      alert("you don't have permission to view this Token!");
      return;
    }
    this.setState({ loading: !checked });
    console.log("state", this.state);
    console.log("var permission", permission);
    console.log("state permission", this.state.permission);
    switch (this.state.permission) {
      case "0":
        console.log("case 0");
        this.setState({
          tabs: this.state.tabs.map((item, index) =>
            index >= 0 ? (item = false) : (item = false)
          ),
          access: "No Access"
        });
        break;
      case "1":
        console.log("case 1");
        this.setState({
          tabs: this.state.tabs.map((item, index) =>
            index >= 1 ? (item = true) : (item = false)
          ),
          access: "Read"
        });
        break;
      case "2":
        console.log("case 2");
        this.setState({
          tabs: this.state.tabs.map((item, index) =>
            index >= 2 ? (item = true) : (item = false)
          ),
          access: "Write"
        });
        break;
      case "4":
        console.log("case 4");
        this.setState({
          tabs: this.state.tabs.map((item, index) =>
            index >= 3 ? (item = true) : (item = false)
          ),
          access: "Edit ACL"
        });
        break;
      case "8":
        console.log("case 8");
        this.setState({
          tabs: this.state.tabs.map((item, index) =>
            index >= 4 ? (item = true) : (item = false)
          ),
          access: "Creator"
        });
        break;
      default:
        console.log("default");
        break;
    }
  };

  renderLoading = () => {
    const { loading } = this.state;
    if (!(this.state.dataKey in this.props.SKUToken.getAccessLevelOfUser)) {
      return;
    } else {
      console.log("props", this.props.SKUToken);
      return (
        <div style={{ textAlign: "center" }}>
          <Switch
            checked={!loading}
            onChange={this.handleOnLoad}
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
          ></Switch>
          <Skeleton loading={loading} active>
            {this.renderPermissionedInfo()}
          </Skeleton>
        </div>
      );
    }
  };

  handleView() {}

  handleUpdate() {}

  handleEditACL() {}
  handleMint() {}

  renderPermissionedInfo = () => {
    return (
      <Card
        style={{ width: "100%", margin: "20px 0px" }}
        title={`${this.state.access} Permission for Token ID: ${this.state.searchTokenId}`}
      >
        <Tabs>
          <TabPane
            tab="View Metadata"
            disabled={this.state.tabs[0]}
            key="1"
            onTabClick={this.handleView}
          >
            Tab 1
          </TabPane>
          <TabPane
            tab="Update Metadata"
            disabled={this.state.tabs[1]}
            key="2"
            onTabClick={this.handleUpdate}
          >
            Tab 2
          </TabPane>
          <TabPane
            tab="Edit Access Control"
            disabled={this.state.tabs[2]}
            key="3"
            onTabClick={this.handleEditACL}
          >
            <EditACL
              permission={this.state.permission}
              tokenId={this.state.searchTokenId}
            />
          </TabPane>
          <TabPane
            tab="Mint Tokens"
            disabled={this.state.tabs[3]}
            key="4"
            onTabClick={this.handleMint}
          >
            Tab 4
          </TabPane>
        </Tabs>
      </Card>
    );
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
          {this.renderLoading()}
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
