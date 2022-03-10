// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
import "./ISolidlyLens.sol";

/**
 * @title OxPool
 * @author 0xDAO
 * @dev For every Solidly pool there is a corresponding oxPool
 * @dev oxPools represent a 1:1 ERC20 wrapper of a Solidly LP token
 * @dev For every oxPool there is a corresponding Synthetix MultiRewards contract
 * @dev oxPool LP tokens can be staked into the Synthetix MultiRewards contracts to allow LPs to earn fees
 */
interface IOxPool {
    function stakingAddress() external view returns (address);

    function solidPoolAddress() external view returns (address);

    function solidPoolInfo() external view returns (ISolidlyLens.Pool memory);

    function depositLpAndStake(uint256) external;

    function depositLp(uint256) external;

    function withdrawLp(uint256) external;

    function syncBribeTokens() external;

    function notifyBribeOrFees() external;

    function initialize(
        address,
        address,
        address,
        string memory,
        string memory,
        address,
        address
    ) external;

    function gaugeAddress() external view returns (address);

    function balanceOf(address) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);
}
