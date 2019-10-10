import React, { Component } from "react";
import { Card, Statistic, Row, Col, Button, Input } from "antd";
import { drizzleConnect } from "@drizzle/react-plugin";
import PropTypes from "prop-types";

//TODO: display tokens owned

class Tokens extends Component {
  constructor(props, context) {
    super(props);
    this.state = {};
    this.contract = context.drizzle.contracts.SKUToken;
    console.log(this.props);
  }
  render() {
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

Tokens.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    SKUToken: state.contracts.SKUToken,
    accounts: state.accounts,
    accountBalances: state.accountBalances,
    drizzleStatus: state.drizzleStatus
  };
};

export default drizzleConnect(Tokens, mapStateToProps);
