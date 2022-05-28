import Ganache from "ganache";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import TestContract from "../helpers/contractCompiler";
import {
  getBlocks,
  getTransactions,
  getTotals,
  getContractAddresses,
  getContractPercentage,
  getUncleCount,
  getAddressCount,
  getContractCount,
  getEventCount

} from "../helpers/blockExplorer";

describe("Block Explorer functions", () => {

  let accounts, web3, provider, account0InitialBalance, account1InitialBalance, account2InitialBalance, currentBlock,
    blocks, transactions, contractInstance, receiverTotals, senderTotals, contractAddresses,
    expectedReceiverTotals, expectedcontractAddresses, expectedSenderTotals;

  const initAccounts = async () => {
    provider = Ganache.provider();
    web3 = new Web3(provider);
    accounts = await web3.eth.getAccounts();
  };

  const deployContract = async () => {
    const instance = new web3.eth.Contract(TestContract.abi);
    const deployedInstance = await instance
      .deploy({ data: TestContract.evm.bytecode.object })
      .send({ from: accounts[0], gas: 150000 });
    contractInstance = deployedInstance;
  };

  const makeTransfers = async () => {
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[1],
      value: web3.utils.toWei("1", "ether")
    });
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[2],
      value: web3.utils.toWei("2", "ether")
    });
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: accounts[2],
      value: web3.utils.toWei("1", "ether")
    });
  };

  const setInitialAccountBalances = async () => {
    account0InitialBalance = new BigNumber(
      await web3.eth.getBalance(accounts[0])
    );
    account1InitialBalance = new BigNumber(
      await web3.eth.getBalance(accounts[1])
    );
    account2InitialBalance = new BigNumber(
      await web3.eth.getBalance(accounts[2])
    );
  };

  const setExpectedValues = () => {
    expectedReceiverTotals = {
      [accounts[1]]: web3.utils.toWei("1"),
      [accounts[2]]: web3.utils.toWei("3"),
      [contractInstance._address]: "0",
      null: "0",
    };

    expectedcontractAddresses = {
      [accounts[0]]: false,
      [accounts[1]]: false,
      [accounts[2]]: false,
      [contractInstance._address]: true
    };

    expectedSenderTotals = {
      [accounts[0]]: web3.utils.toWei("4")
    };
  };

  const emitEvents = async () => {
    await contractInstance.methods.store(10).send({ from: accounts[0] });
  }

  beforeAll(async () => { 
    await initAccounts();
    await deployContract();

    await setInitialAccountBalances();

    await emitEvents();

    await makeTransfers();

    setExpectedValues();

    currentBlock = await web3.eth.getBlockNumber();
    const blockNums = Array.from({ length: currentBlock + 1 }, (_, i) => i);
    blocks = await getBlocks(blockNums, web3);
    transactions = await getTransactions(blocks);
  });

  test("it should show that 3 ETH transferred from other accounts to accounts[2]", async () => {
    const account2CurrentBalance = new BigNumber(await web3.eth.getBalance(accounts[2]));
    expect(account2CurrentBalance.minus(account2InitialBalance).toString()).toEqual(
      web3.utils.toWei("3")
    );
  });

  test("it should show that 1 ETH transferred from other accounts to accounts[1]", async () => {
    const account1CurrentBalance = new BigNumber(await web3.eth.getBalance(accounts[1]));
    expect(account1CurrentBalance.minus(account1InitialBalance).toString()).toEqual(
      web3.utils.toWei("1")
    );
  });

  test("it should return receipient addresses and the total received", async () => {
    receiverTotals = await getTotals("to", transactions);
    expect(receiverTotals).toEqual(expectedReceiverTotals);
  });

  test("it should return sender addresses and the total sent", async () => {
    senderTotals = await getTotals("from", transactions);
    expect(senderTotals).toEqual(expectedSenderTotals);
  });

  test("it should return unique contract addresses", async () => {
    contractAddresses = await getContractAddresses(
      transactions,
      web3
    );

    expect(contractAddresses).toEqual(expectedcontractAddresses)
  });

  test("it should return percentage of transactions being contract transactions", async () => {
    const contractPercentage = getContractPercentage(transactions, contractAddresses)
    expect(contractPercentage).toEqual((1 / 5) * 100)
  });

  test("it should return uncle count", () => {
    const uncleCount = getUncleCount(blocks)
    expect(uncleCount).toEqual(0)
  })

  test("it should return receiving address count", () => {
    const receiverAddressCount = getAddressCount(receiverTotals)
    expect(receiverAddressCount).toEqual(3)
  })

  test("it should return sending address count", () => {
    const senderAddressCount = getAddressCount(senderTotals)
    expect(senderAddressCount).toEqual(1)
  })

  test("it should return proper number of created contracts", () => {
    const contractCount = getContractCount(transactions)
    expect(contractCount).toEqual(1)
  })

  test("it should return proper number of emitted events", async () => {
    const eventCount = await getEventCount(transactions, web3)
    expect(eventCount).toEqual(1)
  })
});