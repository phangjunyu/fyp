import React, { Component } from "react";
import { Card, Row, Col, Input, Form, Button } from "antd";
class SearchAndCreate extends Component {
  state = {};
  render() {
    const { Search } = Input;
    return (
      <div style={{ background: "#000000", padding: "0px 30px 30px" }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Search Token" bordered={false}>
              <Search
                placeholder="Enter Token ID"
                enterButton
                size="small"
                onSearch={value => console.log(value)}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Create New Token" bordered={false}>
              <Form layout="horizontal" style={{ backgroundColor: "white" }}>
                <Form.Item
                  label="Field A"
                  {...{
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 }
                  }}
                  style={{ margin: "0px" }}
                >
                  <Input placeholder="Initial Supply" />
                </Form.Item>
                <Form.Item
                  label="Field B"
                  {...{
                    labelCol: { span: 4 },
                    wrapperCol: { span: 14 }
                  }}
                  style={{ margin: "0px" }}
                >
                  <Input placeholder="IPFS URI of JSON Metadata" />
                </Form.Item>
                <Form.Item style={{ margin: "0px" }}>
                  <Button
                    style={{ backgroundColor: "green" }}
                    type="primary"
                    {...{
                      wrapperCol: { span: 14 }
                    }}
                  >
                    Create Token
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SearchAndCreate;
