pragma solidity ^0.8.0;

// import ERC1155 token from Openaeppelin
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract SimpleNFTContract is ERC1155, Ownable {

    uint256 public constant SMTH = 0;
    uint256 public constant SMTHELSE = 1;
    uint256 public constant ANYTHELSE = 2;

    constructor() ERC1155("https://ra60ejm4csdi.usemoralis.com/{id}.json") {
        _mint(msg.sender, SMTH, 1, "");
        _mint(msg.sender, SMTHELSE, 1, "");
        _mint(msg.sender, ANYTHELSE, 1, "");
    }

    function mint(address account, uint256 id, uint256 amount) public onlyOwner {
        _mint(account, id, amount, "");
    }

    function burn(address account, uint256 id, uint256 amount) public {
        require(msg.sender == account);
        _burn(account, id, amount);
    }

}