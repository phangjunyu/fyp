import React, { Component } from "react";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import { Icon, Input, Tooltip, Radio, Card, Button } from "antd";

class EditACL extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      tokenId: this.props.tokenId,
      updateeAddress: "",
      accessLevel: 1
    };
    this.contract = context.drizzle.contracts.SKUToken;
    const events = this.contract.events;
    events["PermissionSet"]().on("data", event => {
      const tokenId = event.returnValues._id;
      var permission;
      switch (event.returnValues._permission) {
        case 1:
          permission = "Read Data";
          break;
        case 2:
          permission = "Update Data";
          break;
        case 4:
          permission = "Owner Access Control";
          break;
        case 8:
          permission = "Creator";
          break;
        default:
          permission = "No";
          break;
      }
      const message = `${permission} Permission set for User ${event.returnValues._updateeAddress}`;
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

  onChange = e => {
    this.setState({
      accessLevel: e.target.value
    });
  };

  handleInputChange = e => {
    let value = e.target.value;
    this.setState({ [e.target.name]: value });
  };

  handleUpdateAccess = e => {
    const method = this.contract.methods.setPermission;
    method.cacheSend(...Object.values(this.state), {
      from: this.props.accounts[0]
    });
    // clear inputs after submission
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
      <Card
        bordered={false}
        title="Enter the address of the account to give access to"
      >
        <Input
          name="updateeAddress"
          placeholder="Account Address, i.e. 0xfb1231...."
          prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
          suffix={
            <Tooltip title="Please enter only one address">
              <Icon type="info-circle" style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
          onChange={this.handleInputChange}
        />
        <br />
        <Radio.Group onChange={this.onChange} value={this.state.accessLevel}>
          <Radio value={1}>View Metadata</Radio>
          <Radio value={2}>Update Metadata</Radio>
          <Radio value={4}>Edit Access</Radio>
          <Radio value={8}>Mint Tokens</Radio>
        </Radio.Group>
        <br />
        <br />
        <Button
          style={{ background: "teal" }}
          type="primary"
          block
          icon="user-add"
          onClick={this.handleUpdateAccess}
        >
          Update User Access
        </Button>
      </Card>
    );
  }
}

EditACL.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    SKUToken: state.contracts.SKUToken,
    drizzleStatus: state.drizzleStatus,
    accounts: state.accounts
  };
};

export default drizzleConnect(EditACL, mapStateToProps);
