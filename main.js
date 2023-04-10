// main.js


const providerUrl = 'https://nova.arbitrum.io/rpc';

const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"approveEmergencyWithdrawal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimJudgeFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_judge","type":"address"},{"internalType":"uint256","name":"_wagerAmount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"emergencyWithdrawalApproved","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"finalOutcome","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"participant","type":"address"}],"name":"isDeposited","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"judge","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"outcome","type":"uint256"}],"name":"judgeDecision","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"judgeFeeClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"outcomes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant1Deposited","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant2","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"participant2Deposited","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"resetContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"outcome","type":"uint256"}],"name":"submitOutcome","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"wagerAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]; // Replace <ABI_JSON> with the ABI you provided
const contractAddress = '0x3e06f9518A446a127A5bB72011C4EDFF268F13b4'; // Replace with your contract address

let web3;
let contract;
let userAddress;

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      userAddress = (await web3.eth.getAccounts())[0];

      updateContractInfo();

      document.getElementById("connectBtn").style.display = "none";
      document.getElementById("userAddress").style.display = "block";
      document.getElementById("userAddress").innerText = `Connected: ${userAddress}`;

      document.getElementById("depositBtn").disabled = false;
    } catch (error) {
      console.error("Access to accounts denied:", error);
      alert("Access to accounts denied. Check the console for more details.");
    }
  } else {
    alert("No Ethereum provider detected. Please install MetaMask.");
  }
});

document.getElementById("connectBtn").addEventListener("click", connectWallet);
document.getElementById("depositBtn").addEventListener("click", deposit);
document.getElementById("claimBtn").addEventListener("click", claim);
document.getElementById("iWinBtn").addEventListener("click", iWin);
document.getElementById("iLoseBtn").addEventListener("click", iLose);

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(contractABI, contractAddress);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      userAddress = (await web3.eth.getAccounts())[0];
      
      updateContractInfo();

      document.getElementById("connectBtn").style.display = "none";
      document.getElementById("userAddress").style.display = "block";
      document.getElementById("userAddress").innerText = `Connected: ${userAddress}`;

      document.getElementById("depositBtn").disabled = false;
    } catch (error) {
      console.error("Access to accounts denied:", error);
      alert("Access to accounts denied. Check the console for more details.");
    }
  } else {
    alert("No Ethereum provider detected. Please install MetaMask.");
  }
}

async function deposit() {
  const judgeAddress = document.getElementById("judgeAddress").value;
  const wagerAmount = document.getElementById("wagerAmount").value;

  if (web3.utils.isAddress(judgeAddress)) {
    try {
      await contract.methods.deposit(judgeAddress, web3.utils.toWei(wagerAmount, "ether")).send({ from: userAddress, value: web3.utils.toWei(wagerAmount, "ether") });
      alert("Deposit successful!");
      updateContractInfo();
    } catch (error) {
      console.error("An error occurred during the deposit:", error);
      alert("An error occurred during the deposit. Check the console for more details.");
    }
  } else {
    alert("Invalid judge address.");
  }
}

async function updateContractInfo() {
  const wagerAmount = await contract.methods.wagerAmount().call();
  const participant1 = await contract.methods.participant1().call();
  const participant2 = await contract.methods.participant2().call();
  const judge = await contract.methods.judge().call();

  document.getElementById("wagerAmountInfo").innerText = `Wager Amount: ${web3.utils.fromWei(wagerAmount, "ether")} ETH`;
  document.getElementById("participant1Info").innerText = `Participant 1: ${participant1 === "0x0000000000000000000000000000000000000000" ? "No participant yet, you can deposit!" : participant1}`;
  document.getElementById("participant2Info").innerText = `Participant 2: ${participant2 === "0x0000000000000000000000000000000000000000" ? "No participant yet, you can deposit!" : participant2}`;
  document.getElementById("judgeInfo").innerText = `Judge: ${judge}`;
}

async function claim() {
  try {
    await contract.methods.claim().send({ from: userAddress });
    alert("Claim successful!");
    updateContractInfo();
  } catch (error) {
    console.error("An error occurred while claiming:", error);
    alert("An error occurred while claiming. Check the console for more details.");
  }
}

async function iWin() {
  try {
    const outcome = (await contract.methods.participant1().call()) === userAddress ? 1 : 2;
    await contract.methods.submitOutcome(outcome).send({ from: userAddress });
    alert("Outcome submitted successfully!");
    updateContractInfo();
  } catch (error) {
    console.error("An error occurred while submitting the outcome:", error);
    alert("An error occurred while submitting the outcome. Check the console for more details.");
  }
}

async function iLose() {
  try {
    const outcome = (await contract.methods.participant1().call()) === userAddress ? 2 : 1;
    await contract.methods.submitOutcome(outcome).send({ from: userAddress });
    alert("Outcome submitted successfully!");
    updateContractInfo();
  } catch (error) {
    console.error("An error occurred while submitting the outcome:", error);
    alert("An error occurred while submitting the outcome. Check the console for more details.");
  }
}

