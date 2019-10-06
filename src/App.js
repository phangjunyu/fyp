import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DrizzleProvider } from "@drizzle/react-plugin";
import { LoadingContainer } from "@drizzle/react-components";
import drizzleOptions from "./drizzleOptions";

import Tokens from "./components/tokens";
import SearchBar from "./components/searchBar";
import TokenInfo from "./components/tokenInfo";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <DrizzleProvider options={drizzleOptions}>
        <LoadingContainer>
          <main className="container">
            <Tokens />
            <SearchBar />
            <TokenInfo />
          </main>
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
