// main.js

const contractABI = [{"inputs":[...]}]; // Include the complete ABI here
const contractAddress = "YOUR_CONTRACT_ADDRESS";
const rpcURL = "YOUR_RPC_URL"; // Replace with your RPC URL, for example: https://mainnet.infura.io/v3/YOUR-PROJECT-ID

let web3;
let contract;
let userAddress;

window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
      contract = new web3.eth.Contract(contractABI, contractAddress);
      initializeUI();
    } catch (error) {
      console.error("User denied account access");
    }
  } else {
    console.error("No web3 provider detected");
  }
});

async function initializeUI() {
  const accounts = await web3.eth.getAccounts();
  userAddress = accounts[0];

  document.getElementById("connectBtn").addEventListener("click", async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      document.getElementById("connectBtn").style.display = "none";
      document.getElementById("userAddress").innerText = `Connected: ${userAddress}`;
      document.getElementById("userAddress").style.display = "block";
      document.getElementById("depositBtn").disabled = false;
    } catch (error) {
      console.error("User denied account access");
    }
  });

  document.getElementById("depositBtn").addEventListener("click", async () => {
    const judgeAddress = document.getElementById("judgeAddress").value;
    const wagerAmount = document.getElementById("wagerAmount").value;

    if (!web3.utils.isAddress(judgeAddress)) {
      alert("Please enter a valid judge address");
      return;
    }

    try {
      const value = web3.utils.toWei(wagerAmount, "ether");
      await contract.methods.deposit(judgeAddress, value).send({ from: userAddress, value });
      alert("Deposit successful");
    } catch (error) {
      console.error("Error while depositing:", error);
    }
  });

  document.getElementById("claimBtn").addEventListener("click", async () => {
    try {
      await contract.methods.claim().send({ from: userAddress });
      alert("Claim successful");
    } catch (error) {
      console.error("Error while claiming:", error);
    }
  });

  document.getElementById("p1WinBtn").addEventListener("click", async () => {
    try {
      await contract.methods.submitOutcome(1).send({ from: userAddress });
      alert("Outcome submitted: Participant 1 wins");
    } catch (error) {
      console.error("Error while submitting outcome:", error);
    }
  });

  document.getElementById("p1LoseBtn").addEventListener("click", async () => {
    try {
      await contract.methods.submitOutcome(2).send({ from: userAddress });
      alert("Outcome submitted: Participant 1 loses");
    } catch (error) {
      console.error("Error while submitting outcome:", error);
    }
  });

  document.getElementById("p2WinBtn").addEventListener("click", async () => {
    try {
      await contract.methods.submitOutcome(2).send({ from: userAddress });
      alert("Outcome submitted: Participant 2 wins");
    } catch (error) {
      console.error("Error while submitting outcome:", error);
    }
  });

  // Fetch contract information
  const owner = await contract.methods.owner().call();
  const judge = await contract.methods.judge().call();
  const participant1 = await contract.methods.participant1().call
  Copy code
  const participant2 = await contract.methods.participant2().call();
  const wagerAmount = await contract.methods.wagerAmount().call();
  const wagerAmountInEther = web3.utils.fromWei(wagerAmount, "ether");

  const participant1Text = participant1 === "0x0000000000000000000000000000000000000000" ? "No participant yet, you can deposit!" : participant1;
  const participant2Text = participant2 === "0x0000000000000000000000000000000000000000" ? "No participant yet, you can deposit!" : participant2;

  document.getElementById("contract-info").innerHTML = `
    <p>Owner: ${owner}</p>
    <p>Judge: ${judge}</p>
    <p>Participant 1: ${participant1Text}</p>
    <p>Participant 2: ${participant2Text}</p>
    <p>Wager Amount: ${wagerAmountInEther} ETH</p>
  `;
}
