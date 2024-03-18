// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRetroBridgePhases {
    
    event SetBaseURI(string baseURI);
    event SetDefaultURI(string defaultUri);
    event SetURI(uint256 nftId, string uri);
    event SetWhitelist(address from, uint256 nftId, address account, bool whitelist);
    event Mint(address from, address to, uint256 nftId, uint256 value);
    event MintBatch(address from, address to, uint256[] nftIds, uint256[] values);

    function SUNRISE_NFT_ID() external view returns (uint8);
    
    function MIDDAY_NFT_ID() external view returns (uint8);
    
    function SUNSET_NFT_ID() external view returns (uint8);
    
    function MIDNIGHT_NFT_ID() external view returns (uint8);

    function whitelist(uint256 nftId, address account) external view returns (bool);
    
    function uri(uint256 nftId) external view returns (string memory);
 
    function balanceOf(address account, uint256 nftId) external view returns (uint256);

    function balanceOfBatch(address[] memory accounts, uint256[] memory ids) external view returns (uint256[] memory);

    function totalSupply() external view returns (uint256);

    function totalSupply(uint256 nftId) external view returns (uint256);

    function exists(uint256 nftId) external view returns (bool);

    function checkId(uint256 nftId) external pure;

    function mint(address to, uint256 nftId, uint value) external;

    function mintBatch(address to, uint256[] memory nftIds, uint256[] memory values) external;

    function owner() external view returns (address);

    /** ONLY OWNER **/

    function setWhitelist(uint256 nftId, address account, bool whitelisted) external;

    function setBaseURI(string memory _baseURI) external;

    function setDefaultURI(string memory _uri) external;

    function setURI(uint256 nftId, string memory _uri) external;

    /** END ONLY OWNER **/
}