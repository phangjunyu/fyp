import { Connectors } from "web3-react";

const { InjectedConnector } = Connectors;

const Injected = new InjectedConnector({
  supportedNetworks: [1, 4]
});

export default { Injected };
