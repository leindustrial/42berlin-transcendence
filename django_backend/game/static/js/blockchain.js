import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constants.js";
import { winner } from "./offline_tour.js";

export function blockchain_handler() {
  const blockchainHtml = `
        <div id="blockchain">
            <div class="container my-5">
                <div class="position-relative p-5 text-center text-muted bg-body border border-dashed rounded-5">
                    <div id="spinner" class="spinner-border text-primary d-none" role="status">
                        <span class="sr-only"></span>
                    </div>
                    <h6 class="text-body-emphasis">Submit Transaction to Ethereum Blockchain</h6>
                    <p class="col-lg-6 mx-auto mb-4">
                        Submitting a transaction to the Ethereum blockchain will broadcast it to the network for validation by validators.
                        Once confirmed, The Winner is recorded on the blockchain, ensuring transparency and security.
                    </p>
                    <button type="button" id="connectButton" class="btn btn-outline-primary btn-lg px-4">Connect Wallet</button>
                    <button type="button" id="fundButton" class="btn btn-outline-secondary btn-lg px-4">Save Name</button>
                    <br><br>
                    <div id="alertContainer"></div>
                </div>
            </div>
        </div>
    `;

  setElementinnerHTML(document.getElementById("game-place"), blockchainHtml);
  showElement(document.getElementById("game-place"));

  const connectButton = document.getElementById("connectButton");
  const fundButton = document.getElementById("fundButton");
  const spinner = document.getElementById("spinner");
  const alertContainer = document.getElementById("alertContainer");

  connectButton.onclick = connect;
  fundButton.onclick = fund;

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        connectButton.innerHTML = "Connected";
      } catch (error) {
        console.error(error);
      }
    } else {
      connectButton.innerHTML = "Please install Metamask";
    }
  }

  async function fund() {
    const username = winner;

    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.recordWinner(username);
        spinner.classList.remove("d-none");
        await listenForTransactionMine(transactionResponse, provider);
        console.log(`Recorded username: ${username}`);
      } catch (error) {
        console.error(error);
      }
    } else {
      fundButton.innerHTML = "Please install Metamask";
    }
  }

  function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations.`
        );
        spinner.classList.add("d-none");
        replaceInputWithAlert(transactionResponse.hash);
        resolve();
      });
    });
  }

  function replaceInputWithAlert(transactionHash) {
    // Remove the input container
    // inputContainer.remove();

    // Create and show the alert
    const alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-success";
    alertDiv.role = "alert";
    alertDiv.innerHTML = `Transaction successful! Check it out on <a href="https://sepolia.etherscan.io/tx/${transactionHash}" class="alert-link" target="_blank">Etherscan</a>.`;
    alertContainer.appendChild(alertDiv);
  }
}
