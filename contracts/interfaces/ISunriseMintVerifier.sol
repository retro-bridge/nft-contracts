// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ISunriseMintVerifier {
    
    event SetMaster(address oldMaster, address newMaster);

    event Mint(address account, uint256 nftId, uint256 value, bytes signature);
    
    function master() external view returns (address);

    function owner() external view returns (address);

    function mint(bytes memory signature) external;

    function verify(address account, bytes memory signature) external view returns (bool);

    /** ONLY OWNER **/

    function setMaster(address _master) external;

    /** END ONLY OWNER **/
}