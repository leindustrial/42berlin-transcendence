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
                    <h6 class="text-body-emphasis">${SUBMIT_ETH}</h6>
                    <p class="col-lg-6 mx-auto mb-4">${ETH_TEXT}</p>
                    <button type="button" id="connectButton" class="btn btn-outline-primary btn-lg px-4">${CONNECT_WALLET}</button>
                    <button type="button" id="fundButton" class="btn btn-outline-secondary btn-lg px-4">${BLOCKCHAIN_FINALIZE}</button>
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
        connectButton.innerHTML = `${CONNCTED}`;
      } catch (error) {
        console.error(error);
      }
    } else {
      connectButton.innerHTML = `${INST_METAMASK}`;
    }
  }

  async function fund() {

    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = now.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const username = `PONG 3.0 tournament | Date:${formattedDate} | winner: ${winner}`;

    // const username = winner; //'PONG 3.0 tournament' + date + 'winner:' + winner


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
      fundButton.innerHTML = `${INST_METAMASK}`;
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
    alertDiv.innerHTML = `${SUCCESS_TRANSACTION} <a href="https://sepolia.etherscan.io/tx/${transactionHash}" class="alert-link" target="_blank">Etherscan</a>.`;
    alertContainer.appendChild(alertDiv);
  }
}
