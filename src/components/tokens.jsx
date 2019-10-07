import React, { Component } from "react";
import { Card, Statistic, Row, Col, Button, Input } from "antd";
import {
  AccountData,
  ContractData,
  ContractForm
} from "@drizzle/react-components";
import { drizzleConnect } from "@drizzle/react-plugin";

class Tokens extends Component {
  state = {};
  render() {
    console.log(this.props);
    return (
      <div style={{ background: "#000000", padding: "30px" }}>
        <Row>
          <Card
            title="Tokens Owned"
            bordered={false}
            extra={
              <Button type="primary" style={{ backgroundColor: "orange" }}>
                Change Account
              </Button>
            }
          >
            <Row gutter={16}>
              <Col span={16}>
                <Statistic
                  title="Your Account Number"
                  value={this.props.accounts[0]}
                  valueStyle={{
                    fontSize: "1em"
                  }}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <Statistic
                  title="Account Balance (Ether)"
                  value={changeWeiToEther(
                    this.props.accountBalances[this.props.accounts[0]]
                  )}
                  valueStyle={{
                    fontSize: "1em"
                  }}
                  precision={2}
                />
              </Col>
            </Row>
          </Card>
        </Row>
      </div>
    );
  }
}

function changeWeiToEther(amount) {
  return amount / 10 ** 18;
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    accountBalances: state.accountBalances
  };
};

export default drizzleConnect(Tokens, mapStateToProps);
