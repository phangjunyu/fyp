import SKUToken from "./abi/SKUToken.json";

const options = {
  contracts: [SKUToken],
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545"
    }
  }
};

export default options;
