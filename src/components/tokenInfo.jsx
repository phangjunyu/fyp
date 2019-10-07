import React, { Component } from "react";
import { Card } from "antd";

const tabList = [
  {
    key: "tab1",
    tab: "View Information"
  },
  {
    key: "tab2",
    tab: "Update URI"
  },
  {
    key: "tab3",
    tab: "Edit Access Control"
  },
  {
    key: "tab4",
    tab: "Mint Tokens"
  }
];

const contentList = {
  tab1: <p>content1</p>,
  tab2: <p>content2</p>,
  tab3: <p>content3</p>,
  tab4: <p>content4</p>
};

class TokenInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  render() {
    return (
      <div style={{ background: "#FFFFFF", padding: "30px" }}>
        <Card
          style={{ width: "100%" }}
          title="Token Information"
          tabList={tabList}
          activeTabKey={this.state.key}
          onTabChange={key => {
            this.onTabChange(key, "key");
          }}
        >
          {contentList[this.state.key]}
        </Card>
      </div>
    );
  }
}

export default TokenInfo;
