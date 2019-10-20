import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DrizzleProvider } from "@drizzle/react-plugin";
import { LoadingContainer } from "@drizzle/react-components";
import drizzleOptions from "./drizzleOptions";

import Header from "./components/header";
import Tokens from "./components/tokens";
import CreateToken from "./components/createToken";
import TokenInfo from "./components/tokenInfo";
import Test from "./components/test";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // TODO: Implement OpenPGPJS
  // Add in Tokens tracking
  // Set up GetPastEvents for Transfers to track current owner of Token

  render() {
    return (
      <DrizzleProvider options={drizzleOptions}>
        <LoadingContainer>
          <main className="Container">
            <Header />
            <Tokens />
            <CreateToken />
            <TokenInfo />
            {/* <Test /> */}
          </main>
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
