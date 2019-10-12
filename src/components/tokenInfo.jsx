import React, { Component } from "react";
import { Card, Input, Tabs, Skeleton, Switch, Icon } from "antd";
import EditACL from "./tokenInfoComponents/editACL";
import ViewMetadata from "./tokenInfoComponents/viewMetadata";
import EditMetadata from "./tokenInfoComponents/editMetadata";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";

const { TabPane } = Tabs;
const { Search } = Input;

class TokenInfo extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      tabs: [true, true, true, true]
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
    const dataKey = method.cacheCall(this.state.searchTokenId, {
      from: this.props.account
    });
    this.setState({ dataKey });
    this.setState({ loading: true });
  };

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  onSwitchChange = checked => {
    var permission = this.props.SKUToken.getAccessLevelOfUser[
      this.state.dataKey
    ].value;
    this.setState({ permission, loading: !checked });
    switch (permission) {
      case "1":
        this.setState({
          tabs: [false, true, true, true],
          access: "Read"
        });
        break;
      case "2":
        this.setState({
          tabs: [false, false, true, true],
          access: "Write"
        });
        break;
      case "4":
        this.setState({
          tabs: [false, false, false, true],
          access: "Edit ACL"
        });
        break;
      case "8":
        this.setState({
          tabs: [false, false, false, false],
          access: "Creator"
        });
        break;
      default:
        alert("you don't have permission to view this Token!");
        this.setState({
          tabs: [true, true, true, true],
          access: "No Access",
          loading: true
        });
        break;
    }
    return;
  };

  renderLoading = () => {
    const { loading } = this.state;
    if (!(this.state.dataKey in this.props.SKUToken.getAccessLevelOfUser)) {
      return;
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <Switch
            checked={!loading}
            onChange={this.onSwitchChange}
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

  renderPermissionedInfo = () => {
    return (
      <Card style={{ width: "100%", margin: "20px 0px", minHeight: "400px" }}>
        <p style={{ fontWeight: "bold" }}>
          Token ID: {this.state.searchTokenId}
          <br />
          Permission Level: {this.state.access}
        </p>
        <Tabs>
          <TabPane tab="View Metadata" disabled={this.state.tabs[0]} key="1">
            <ViewMetadata searchTokenId={this.state.searchTokenId} />
          </TabPane>
          <TabPane tab="Update Metadata" disabled={this.state.tabs[1]} key="2">
            <EditMetadata searchTokenId={this.state.searchTokenId} />
          </TabPane>
          <TabPane
            tab="Edit Access Control"
            disabled={this.state.tabs[2]}
            key="3"
          >
            <EditACL
              permission={this.state.permission}
              tokenId={this.state.searchTokenId}
            />
          </TabPane>
          <TabPane tab="Mint Tokens" disabled={this.state.tabs[3]} key="4">
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
