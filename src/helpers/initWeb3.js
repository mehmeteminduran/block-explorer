import Web3 from "web3";

let web3;
if (typeof window !== "undefined" && window.ethereum) {
  web3 = new Web3(window.ethereum);
  window.ethereum.enable();
}
else if (typeof window !== "undefined" && window.web3) {
  web3 = window.web3;
}
else {
  const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/3b1ec7b124344b6395257a2ba27cc575");
  web3 = new Web3(provider);
}

export default web3;