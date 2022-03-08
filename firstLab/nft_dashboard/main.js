let serverUrl = "https://iftypmmzcbls.usemoralis.com:2053/server"; //Server url from moralis.io
let appId =  "q8lpxiimokbF2QWHjIqExgtZNSwwRDDGiDQQWy57"; // Application id from moralis.io
Moralis.start({ serverUrl, appId});

let contract_addr = "0xE371C77850b55086660B896d2539d54bd3BB2a3e"
let currentUser;

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function fetchNFTMetadata(NFTs) {
    let promises = [];

    for (let i = 0; i < NFTs.length; i++) {
        let nft = NFTs[i];
        let id = nft.token_id;
        // Call Moralis Cloud function -> static JSON file
        promises.push(fetch("https://iftypmmzcbls.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=q8lpxiimokbF2QWHjIqExgtZNSwwRDDGiDQQWy57&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(res => {
            const options = {address: contract_addr, token_id: id, chain: "rinkeby"};
            sleep(2000); // artificial delay to avoid error related to moralis constraints
            return Moralis.Web3API.token.getTokenIdOwners(options);
        })
        .then( (res) => {
            nft.owners  = [];
            res.result.forEach(element => {
                nft.owners.push(element.ownerOf);
            })
            return nft;
        }))
    }

    return Promise.all(promises);
}

function renderInventory(NFTs, ownerData) {
    const parent = document.getElementById("app");

    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
         let htmlString = `
            <div class="card">
                <img src="${nft.metadata.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${nft.metadata.name}</h5>
                    <p class="card-text">${nft.metadata.description}</p>
                    <p class="card-text">Amount: ${nft.amount}</p>
                    <p class="card-text">Number of Owners: ${nft.owners.length}</p>
                    <p class="card-text">Your balance: ${ownerData[nft.token_id]}</p>
                    <a href="mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
                    <a href="transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
                </div>
            </div>
         `

         let col = document.createElement("div");
         col.className = "col col-md-4"
         col.innerHTML = htmlString;
         parent.appendChild(col);
    }
}

async function getOwnerData() {
    let accounts = currentUser.get("accounts");
    const options = {chain: "rinkeby", address: accounts[0], token_address: contract_addr};
    return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
        let result = data.result.reduce((object, currentElement) => {
            object[currentElement.token_id] = currentElement.amount;
            return object;
        }, {})
        return result
    });
}

async function initializeApp() {
    currentUser = Moralis.User.current();
    if (!currentUser) {
        try {
            currentUser = await Moralis.Web3.authenticate();
            console.log(user);
            alert("User logged in")
        } catch (error) {
            console.log(error);
        }
    }

    const options = {address: contract_addr, chain: "rinkeby"}
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    let ownerData = await getOwnerData();

    renderInventory(NFTWithMetadata, ownerData);
}

initializeApp();