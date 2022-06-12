import web3 from "./initWeb3";
import BigNumber from "bignumber.js";

export const getBlockData = async (blockNums) => {

  const blocks = await getBlocks(blockNums, web3);
  const transactions = await getTransactions(blocks);

  const receiverTotals = await getTotals("to", transactions);
  const senderTotals = await getTotals("from", transactions);
  const contractAddresses = await getContractAddresses(transactions, web3);

  const receiverAddresses = getAddressDetails(receiverTotals, contractAddresses);
  const senderAddresses = getAddressDetails(senderTotals, contractAddresses);

  const contractPercentage = getContractPercentage(transactions, contractAddresses).toFixed(1);
  const uncleCount = getUncleCount(blocks);
  const receiverCount = getAddressCount(receiverTotals);
  const senderCount = getAddressCount(senderTotals);
  const contractCount = getContractCount(transactions);
  const eventCount = await getEventCount(transactions, web3);

  return {
    receiverAddresses,
    senderAddresses,
    contractPercentage,
    uncleCount,
    receiverCount,
    senderCount,
    contractCount,
    eventCount
  };
};

export const getBlocks = async (blockNums, web3) => {
  const batch = new web3.eth.BatchRequest();
  let promises = blockNums.map((blockNumber) => {
    return new Promise((resolve, reject) => {
      let request = web3.eth.getBlock.request(blockNumber, true, (error, block) => {
        if (error) {
          reject(error);
        } else {
          resolve(block);
        }
      });
      batch.add(request);
    });
  })

  batch.execute();

  return Promise.all(promises);
};

export const getTransactions = async (blocks) => {
  const transactions = [];
  blocks.forEach(block => {
    transactions.push(...block.transactions);
  });
  return transactions;
};

export const getTotals = async (type, transactions) => {
  let totals = {};
  transactions.forEach(transaction => {
    const address = transaction[type];
    if (totals[address]) {
      totals[address] = new BigNumber(totals[address]).plus(new BigNumber(transaction.value)).toString()
    } else {
      totals[address] = new BigNumber(transaction.value).toString()
    }
  });
  return totals;
};

export const getContractAddresses = async (transactions, web3) => {
  const addresses = mergeSenderAndReceiverAddresses(transactions);
  const addressCodes = await getAddressCodes(addresses, web3);

  let contractAddresses = {};
  for (let i = 0; i < addresses.length; i++) {
    const isContract = addressCodes[i] === "0x" || addressCodes[i] === "0x0" ? false : true;
    contractAddresses[addresses[i]] = isContract;
  }
  return contractAddresses;
};

export const getAddressDetails = (addresses, contractAddresses) => {
  const addressDetails = Object.keys(addresses).filter(addr => addresses[addr] > 0).map((value) => {
    return {
      Address: value === "null" ? "Contract Creation" : value,
      Amount: web3.utils.fromWei(addresses[value].toString()),
      IsContract: contractAddresses[value]
    }
  });

  return addressDetails;
};


export const getContractPercentage = (transactions, contractAddresses) => {
  const contractTransactionCount = transactions
    .map(tx => isContractAddress(tx, contractAddresses) ? 1 : 0)
    .reduce((acc, curr) => acc + curr, 0);

  return (contractTransactionCount / transactions.length) * 100;
};

export const getUncleCount = blocks => {
  return blocks.reduce((acc, curr) => acc + curr.uncles.length, 0);
};

export const getAddressCount = addressTotals => {
  const addressArray = Object.keys(addressTotals).filter(addr => addr !== "null")
  return addressArray.length;
};

export const getContractCount = transactions => {
  return transactions
    .map(tx => (tx.to === null ? 1 : 0))
    .reduce((acc, curr) => acc + curr, 0);
};

export const getEventCount = async (transactions, web3) => {
  const transactionReceipts = await getTransactionReceipts(transactions, web3);
  const numEvents = transactionReceipts.reduce(
    (acc, tx) => acc + tx.logs.length,
    0
  );

  return numEvents;
}

const mergeSenderAndReceiverAddresses = transactions => {
  let addressMap = {};
  transactions.forEach(tx => {
    if (tx.from && !addressMap[tx.from]) {
      addressMap[tx.from] = true;
    }
    if (tx.to && !addressMap[tx.to]) {
      addressMap[tx.to] = true;
    }
  });

  return Object.keys(addressMap);
};

const getAddressCodes = async (addresses = [], web3) => {
  const promises = addresses
    .filter(addr => addr !== "null")
    .map(addr => web3.eth.getCode(addr));

  return Promise.all(promises);
};

const isContractAddress = (transaction, contractAddresses) => {
  return (contractAddresses[transaction.from] || contractAddresses[transaction.to]) ? true : false;
}

const getTransactionReceipts = async (transactions, web3) => {
  const promises = transactions.map(tx =>
    web3.eth.getTransactionReceipt(tx.hash)
  );

  return Promise.all(promises);
};