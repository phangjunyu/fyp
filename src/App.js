import React, { Component } from "react";
import ReactDOM from "react-dom";
import Tokens from "./components/tokens";
import SearchBar from "./components/searchBar";
import TokenInfo from "./components/tokenInfo";
import Web3 from "web3";
import contract from "@truffle/contract";
import SKUToken from "./abi/SKUToken.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { account: "" };

    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */});
      } catch (error) {
        // User denied account access...
      }
    }

    this.web3 = new Web3(this.web3Provider);

    this.SKUToken = contract(SKUToken);
    this.SKUToken.setProvider(this.web3Provider);
  }

  componentDidMount() {
    if (this.web3 && this.web3.isConnected()) {
      this.web3.eth.getAccounts().then(function(acc) {
        this.setState({ account: this.acc[0] });
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <main className="container">
          <Tokens account={this.state.account} />

          <SearchBar
          //whatever props
          />
          <TokenInfo
          //props
          />
        </main>
      </React.Fragment>
    );
  }
}

export default App;
