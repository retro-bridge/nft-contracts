// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IRetroBridgePhases.sol";
import "./interfaces/ISunriseMintVerifier.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract SunriseMintVerifier is Ownable2Step, EIP712, ISunriseMintVerifier {
    using SafeERC20 for IERC20;
    using ECDSA for bytes;

    IRetroBridgePhases public retrobridgeNFT;

    uint8 public sunriseNftId;

    address public master;

    struct SunriseMintData {
        address account;
    }

    constructor (address _retrobridgeNFT) 
        Ownable(msg.sender) 
        EIP712("SunriseMintVerifier", "1") 
    {
        retrobridgeNFT = IRetroBridgePhases(_retrobridgeNFT);
        sunriseNftId = retrobridgeNFT.SUNRISE_NFT_ID();
        master = msg.sender;
    }

    function setMaster(address _master) public onlyOwner() {
        emit SetMaster(master, _master);
        master = _master;
    }

    function mint(bytes memory signature) public {
        address account = msg.sender;
        uint256 sunriseBalance = retrobridgeNFT.balanceOf(account, sunriseNftId);
        require(sunriseBalance == 0, "SunriseMinter: only one token to account");
        require(verify(account, signature), "SunriseMinter: invalid signature");
        uint256 value = 1;
        retrobridgeNFT.mint(account, sunriseNftId, value);
        emit Mint(account, sunriseNftId, value, signature);
    }

    function verify(address account, bytes memory signature) public view returns (bool) {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("SunriseMintData(address account)"),
                    account
                )
            )
        );

        address recoveredAddress = ECDSA.recover(digest, signature);
        return recoveredAddress == master;
    }

    function chainId() public view returns (uint256) {
        return block.chainid;
    }

 
    function owner() public view override(Ownable, ISunriseMintVerifier) returns (address) {
        return Ownable.owner();
    }
}
