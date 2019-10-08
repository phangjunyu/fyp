import React, { Component } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Form,
  Button,
  Upload,
  message,
  Icon
} from "antd";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";

const uploadProps = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text"
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};

class CreateAndUpload extends Component {
  constructor(props, context) {
    super(props);
    this.contract = context.drizzle.contracts.SKUToken;
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
    method.cacheSend(...Object.values(this.state), {
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
                <Form.Item
                  label="Initial Supply"
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
                </Form.Item>
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
                    placeholder="IPFS URI to JSON Metadata"
                    value={this.state == null ? "" : this.state["_uri"]}
                  />
                </Form.Item>
                <Form.Item style={{ margin: "0px" }}>
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
            <Col>
              <Card title="Upload IPFS JSON File" bordered={false}>
                <Upload {...uploadProps}>
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
              </Card>
            </Col>
          </Col>
        </Row>
      </div>
    );
  }
}

CreateAndUpload.contextTypes = {
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

export default drizzleConnect(CreateAndUpload, mapStateToProps);
