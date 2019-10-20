import React, { Component } from "react";
import { Card, Row, Col, Input, Form, Button } from "antd";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";
import UploadIPFS from "./uploadIPFS";

class CreateToken extends Component {
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

  handleSubmit = event => {
    event.preventDefault();
    // const supply = event.target[0].value;
    // const uri = event.target[1].value;
    const method = this.contract.methods.create;
    method.cacheSend(...[1, this.state._uri], {
      from: this.props.account
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
      <div style={{ background: "#000000", padding: "0px 30px 30px" }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Create New Token" bordered={false}>
              <Form
                onSubmit={this.handleSubmit}
                layout="horizontal"
                style={{ backgroundColor: "white" }}
              >
                {/* <Form.Item
                  label="Type"
                  {...{
                    labelCol: { span: 6 },
                    wrapperCol: { span: 14 }
                  }}
                  style={{ margin: "0px" }}
                >
                  <Input
                    name="_initialSupply"
                    onChange={this.handleInputChange}
                    placeholder="in Wei"
                    value={
                      this.state == null ? "" : this.state["_initialSupply"]
                    }
                  />
                </Form.Item> */}
                {/* TOOD: set function call to automatically be NFT type */}
                <Form.Item
                  label="URI"
                  {...{
                    labelCol: { span: 6 },
                    wrapperCol: { span: 14 }
                  }}
                  style={{ margin: "0px" }}
                >
                  <Input
                    name="_uri"
                    onChange={this.handleInputChange}
                    placeholder="IPFS Hash of JSON Metadata"
                    value={this.state == null ? "" : this.state["_uri"]}
                  />
                </Form.Item>
                <Form.Item style={{ margin: "0px", textAlign: "center" }}>
                  <Button
                    style={{ backgroundColor: "green" }}
                    type="primary"
                    htmlType="submit"
                  >
                    Create Token
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={12}>
            <UploadIPFS />
          </Col>
        </Row>
      </div>
    );
  }
}

CreateToken.contextTypes = {
  drizzle: PropTypes.object
};

//tells you which contracts you want to get as stateful props
// These props are just states that contain the data you’ve received for a certain contract. You can’t make any kind of calls with these objects.
const mapStateToProps = state => {
  return {
    SKUToken: state.contracts.SKUToken,
    drizzleStatus: state.drizzleStatus
  };
};

export default drizzleConnect(CreateToken, mapStateToProps);
