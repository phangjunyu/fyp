import React, { Component } from "react";
import { Card, Statistic, Row, Col, Button } from "antd";

class Tokens extends Component {
  state = {};
  render() {
    return (
      <div style={{ background: "#ECECEC", padding: "30px" }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card
              title="Tokens Owned"
              bordered={false}
              extra={
                <Button type="primary" style={{ backgroundColor: "green" }}>
                  Create New Token
                </Button>
              }
            >
              <Col span={12}>
                <Statistic
                  title="Your Account Number"
                  value={this.props.account}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Account Balance (CNY)"
                  value={112893}
                  precision={2}
                />
                <Button style={{ marginTop: 16 }} type="primary">
                  Recharge
                </Button>
              </Col>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Tokens;
