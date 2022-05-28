const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'Contracts', 'TestContract.sol');
const source = fs.readFileSync(contractPath, 'UTF-8');

// The last line of codes need to be changed like below.
const input = {
    language: "Solidity",
    sources: {
      "TestContract.sol": {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
   
  module.exports = output.contracts["TestContract.sol"].TestContract;