let serverUrl = "https://ipggf3lltmw3.usemoralis.com:2053/server"; //Server url from moralis.io
let appId =  "3b9lPAiTrELmjeW2gN3EZASJDSxn6uACfZ5Boo5P"; // Application id from moralis.io
Moralis.start({ serverUrl, appId});

let contract_addr = "0xE371C77850b55086660B896d2539d54bd3BB2a3e"

let web3;

async function init() {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
        window.location.pathname = "/index.html";
    }

    web3 = await Moralis.Web3.enable();

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    document.getElementById("token_id_input").value = nftId;
}

async function transfer() {
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value);

    const options = {type: "erc1155",
                     receiver: address,
                     contract_address: contract_addr,
                     token_id: tokenId.toString(),
                     amount: amount}
    let result = await Moralis.transfer(options);
    console.log(result);
}

document.getElementById("submit_transfer").onclick = transfer;

init();