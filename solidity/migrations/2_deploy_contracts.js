var SKUToken = artifacts.require("SKUToken");

module.exports = function(deployer) {
  deployer.deploy(SKUToken);
};
