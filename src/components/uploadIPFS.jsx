import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Upload,
  message,
  Icon,
  Empty,
  Form
} from "antd";
import ipfs from "./ipfs";

class UploadIPFS extends Component {
  constructor(props, context) {
    super(props);
    this.state = { ipfsHash: "" };
  }

  onUploadChange = info => {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      this.setState({ ipfsHash: "" });
      let reader = new window.FileReader();
      reader.readAsArrayBuffer(info.file.originFileObj);
      reader.onloadend = () => this.convertToBuffer(reader);
      //call ipfs here
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  convertToBuffer = async reader => {
    //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({ buffer });
  };

  onSubmit = async event => {
    event.preventDefault();
    console.log("event", event);
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash);
      this.setState({ ipfsHash: ipfsHash[0].hash });
    });
  };

  copyToClipboard = () => {
    navigator.clipboard.writeText(this.state.ipfsHash);
    message.success("copied to clipboard!");
  };

  renderIPFSHash = () => {
    if (this.state.ipfsHash === "") {
      return (
        <Empty description="Upload a File to IPFS">
          {this.renderUploadButton()}
        </Empty>
      );
    } else {
      return (
        <div>
          <Row style={{ margin: "0px 0px 10px 0px" }}>
            <Col>File Hash: {this.state.ipfsHash}</Col>
          </Row>
          <Row style={{ margin: "10px 0px" }}>
            <Col>{this.renderUploadButton()}</Col>
          </Row>
        </div>
      );
    }
  };

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  renderUploadButton = () => {
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Item label="">
          <Upload
            name="file"
            onChange={this.onUploadChange}
            customRequest={this.dummyRequest}
          >
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>
          <Button
            htmlType="submit"
            type="primary"
            style={{ backgroundColor: "cadetblue" }}
          >
            Get IPFS Hash <Icon type="rocket" />
          </Button>
        </Form.Item>
      </Form>
    );
  };

  render() {
    return (
      <Card
        title="Upload IPFS JSON File"
        bordered={false}
        extra={
          <Button onClick={this.copyToClipboard}>
            Copy to Clipboard
            <Icon type="copy" />
          </Button>
        }
      >
        {this.renderIPFSHash()}
      </Card>
    );
  }
}

export default UploadIPFS;
