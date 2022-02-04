import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import MUD from "./artifacts/contracts/Mudded.sol/MUDDED.json";
import { getAccountPath } from "ethers/lib/utils";
import { Web3Provider } from "@ethersproject/providers";

// contract address
const mudAddress = "0x537430782EDA32B4C8594b0412C81c5B1dE3f821";

function App() {
  // connect to metamask wallet of user
  async function requestAccount() {
    // prompt user to connect one of their metamask account
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // Minting my NFT
  async function mintNFT() {
    if (typeof window.ethereum !== "undefined") {
      // Wait for Wallet to be connected
      await requestAccount(); // Gives access to wallet
      // create a new provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const gasPrice = await provider.getGasPrice();
      // sign transaction using a signer, cause we will create an update in the blockchain
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mudAddress, MUD.abi, signer);
      //now we can create the transaction ( writing )
      const transaction = await contract.safeMint(
        window.ethereum.selectedAddress,
        "https://ipfs.io/ipfs/Qmdjr4L4FHNZjbYVEQr6FPiUZyqhyBBfYUAmQDqiWBJQvT",
        {
          value: ethers.utils.parseEther("0.05"),
          gasPrice: ethers.utils.parseUnits("100", "gwei"),
          gasLimit: 1000000,
        }
      ); // safe mint to this address
      // wait for the transaction to be confirmed in the blockchain ( in production environment in takes longer )
      await transaction.wait();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>{window.ethereum.selectedAddress}</div>
        <button onClick={mintNFT}> Mint</button>
      </header>
    </div>
  );
}

export default App;
