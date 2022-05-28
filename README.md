#  Ether Cash Flow Tool 

### Getting Started
Block Explorer is an application which lets a user access ad-hoc blockchain data. It displays an Ether transfer report by answering below questions: 
- How much Ether was transferred in total? 
- Which addresses received Ether and how much did they receive in total? 
- Which addresses sent Ether and how much did they send in total? 
- Of these addresses, which are contract addresses? 
- What percentage of transactions were contract transactions? 
- How many uncles were there? 
- How many unique addresses sent transactions? 
- How many unique addresses received transactions? 
- How many contracts were created? 
- How many events were fired in total? 


To get started, clone this repository from GitHub and install the dependencies with npm or yarn.
                
```
npm install
```

or

```
yarn
```

Next step is running the application using the serve script and navigate to **http://localhost:8080/** to view the application.
That is it, you may now start to explore blocks using the Block Explorer Tool.</p>

```
npm run serve
```

### Vue CLI Scripts
Following commands can be used to build, test, and run application.
```
"npm run serve": Starts the development server
"npm run build": Builds the application for deployment.
"npm run test": Runs the tests.
```

### Structure
Block Explorer tool consists of 2 main parts; the application layout and the resources. Helpers/functions/Contracts and compilers/Web3 instance to communicate with the Ethereum network by connecting to an Ethereum node and to send request are placed inside the **src/helpers/** folder.</p>
 
### Dependencies
If [MetaMask](https://metamask.io) Chrome extension installed your browser, Web3 instance will use it. Otherwise, it will use Infura as provider. 
You can see the data on the network you want by replacing the Infura address with the address of your own account. 

