// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IRetroBridgePhases.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract RetroBridgePhases is Ownable2Step, ERC1155Supply, ERC1155URIStorage, IRetroBridgePhases {

    uint8 public constant SUNRISE_NFT_ID = 0;
    uint8 public constant MIDDAY_NFT_ID = 1;
    uint8 public constant SUNSET_NFT_ID = 2;
    uint8 public constant MIDNIGHT_NFT_ID = 3;

    /// @dev true - whitelisted, false - not whitelisted
    mapping(uint256 nftId => mapping(address account => bool)) public whitelist;

    constructor(string memory _baseURI) Ownable(msg.sender) ERC1155("RetroBridge Phases") {
        _setBaseURI(_baseURI);
        _setURI(0, "0.json");
        _setURI(1, "1.json");
        _setURI(2, "2.json");
        _setURI(3, "3.json");
    }

    /// @dev sets whitelist 
    /// @param account address of account in whitelist
    /// @param whitelisted true - include in whitelist, false - exclude from whitelist
    function setWhitelist(uint256 nftId, address account, bool whitelisted) public onlyOwner {
        checkId(nftId);
        require(whitelist[nftId][account] != whitelisted, "RetroBridgePhases: not changing whitelist state");
        whitelist[nftId][account] = whitelisted;
        emit SetWhitelist(msg.sender, nftId, account, whitelisted);
    }

    function setBaseURI(string memory _baseURI) public onlyOwner() {
        _setBaseURI(_baseURI);
        emit SetBaseURI(_baseURI);
    }

    function setDefaultURI(string memory _uri) public onlyOwner() {
        _setURI(_uri);
        emit SetDefaultURI(_uri);
    }

    function setURI(uint256 nftId, string memory _uri) public onlyOwner() {
        checkId(nftId);
        _setURI(nftId, _uri);
        emit SetURI(nftId, _uri);
    }

    function safeTransferFrom(address, address, uint256, uint256, bytes memory) public pure override {
        revert("RetroBridgePhases: safeTransferFrom is forbidden");
    }

    function safeBatchTransferFrom(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public pure override {
        revert("RetroBridgePhases: safeBatchTransferFrom is forbidden");
    }

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        ERC1155Supply._update(from, to, ids, values);
    }

    function mint(address to, uint256 nftId, uint256 value) public {
        checkId(nftId);
        require(whitelist[nftId][msg.sender], "RetroBridgePhases: msg.sender not whitelisted");
        _mint(to, nftId, value, "");
        emit Mint(msg.sender, to, nftId, value);
    }

    function mintBatch(address to, uint256[] memory nftIds, uint256[] memory values) public {
        for(uint256 i = 0; i < nftIds.length; i++) {
            checkId(nftIds[i]);
            require(whitelist[nftIds[i]][msg.sender], "RetroBridgePhases: msg.sender not whitelisted");
        }
        _mintBatch(to, nftIds, values, "");
        emit MintBatch(msg.sender, to, nftIds, values);
    }

    function uri(uint256 nftId) public view override(ERC1155, ERC1155URIStorage, IRetroBridgePhases) returns (string memory) {
        return ERC1155URIStorage.uri(nftId);
    }

    function balanceOf(address account, uint256 nftId) public view override(ERC1155, IRetroBridgePhases) returns (uint256) {
        checkId(nftId);
        return ERC1155.balanceOf(account, nftId);
    }

    function balanceOfBatch(
        address[] memory accounts,
        uint256[] memory ids
    ) public view override (ERC1155, IRetroBridgePhases) returns (uint256[] memory) {
        return super.balanceOfBatch(accounts, ids);
    }

    function totalSupply(uint256 nftId) public view override(ERC1155Supply, IRetroBridgePhases) returns (uint256) {
        checkId(nftId);
        return ERC1155Supply.totalSupply(nftId);
    }

    function totalSupply() public view override(ERC1155Supply, IRetroBridgePhases) returns (uint256) {
        return ERC1155Supply.totalSupply();
    }

    function exists(uint256 nftId) public view override(ERC1155Supply, IRetroBridgePhases) returns (bool) {
        checkId(nftId);
        return ERC1155Supply.exists(nftId);
    }

    function checkId(uint256 nftId) public pure {
        require(nftId <= MIDNIGHT_NFT_ID, "RetroBridgePhases: invalid nftId");
    }

    function owner() public view override(Ownable, IRetroBridgePhases) returns (address) {
        return Ownable.owner();
    }

}
