// SPDX-License-Identifier: MIT

import './abstract/ReaperBaseStrategy.sol';
import './interfaces/IUniswapRouter.sol';
import './interfaces/IMasterChef.sol';
import './interfaces/IUniswapV2Pair.sol';
import './interfaces/IOxPool.sol';
import './interfaces/IOxLens.sol';
import './interfaces/IBaseV1Pair.sol';
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

pragma solidity 0.8.11;

/**
 * @dev This strategy will farm LPs on OxDao and autocompound rewards
 */
contract ReaperAutoCompoundOxDao is ReaperBaseStrategy {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /**
     * @dev Tokens Used:
     * {WFTM} - Required for liquidity routing when doing swaps. Also used to charge fees on yield.
     * {OXD} - The reward token for farming on OXDAO
     * {SOLID} - The reward token for farming SOLID lps
     * {want} - The vault token the strategy is maximizing
     * {lpToken0} - Token 0 of the LP want token
     * {lpToken1} - Token 1 of the LP want token
     */
    address public constant WFTM = 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83;
    address public constant OXD = 0xc5A9848b9d145965d821AaeC8fA32aaEE026492d;
    address public constant SOLID = 0x888EF71766ca594DED1F0FA3AE64eD2941740A20;
    address public want;
    address public lpToken0;
    address public lpToken1;

    /**
     * @dev Third Party Contracts:
     * {SOLIDLY_ROUTER} - Solidly router for swapping tokens
     * {SPOOKY_ROUTER} - Backup router for swapping illiquid pairs
     * {OXLENS} - Primary view interface for OxDao
     */
    address public constant SOLIDLY_ROUTER = 0xa38cd27185a464914D3046f0AB9d43356B34829D;
    address public constant SPOOKY_ROUTER = 0xF491e7B69E4244ad4002BC14e878a34207E38c29;
    address public constant OXLENS = 0xDA00137c79B30bfE06d04733349d98Cf06320e69;

    /**
    * @dev OxDao variables
    * {oxPool} - OxDao pool for the want
    * {stakingAddress} - staking address for the pool
    */
    address public oxPool;
    address public stakingAddress;

    /**
     * @dev Initializes the strategy. Sets parameters, saves routes, and gives allowances.
     * @notice see documentation for each variable above its respective declaration.
     */
    function initialize(
        address _vault,
        address[] memory _feeRemitters,
        address[] memory _strategists,
        address _want
    ) public initializer {
        // Initialize
        __ReaperBaseStrategy_init(_vault, _feeRemitters, _strategists);

        // Set values
        want = _want;

        // Derived values
        (lpToken0, lpToken1) = IBaseV1Pair(want).tokens();
        oxPool = IOxLens(OXLENS).oxPoolBySolidPool(address(want));
        stakingAddress = IOxPool(oxPool).stakingAddress();

        // Actions
        _giveAllowances();
    }

    /**
     * @dev Withdraws funds and sents them back to the vault.
     * It withdraws {want} from OxDao
     * The available {want} minus fees is returned to the vault.
     */
    function withdraw(uint _withdrawAmount) external {
        require(msg.sender == vault, "!vault");
        //todo
    }

    /**
     * @dev Returns the approx amount of profit from harvesting.
     *      Profit is denominated in WFTM, and takes fees into account.
     */
    function estimateHarvest() external view override returns (uint profit, uint callFeeToUser) {
    }
    
    /**
     * @dev Function to retire the strategy. Claims all rewards and withdraws
     *      all principal from external contracts, and sends everything back to
     *      the vault. Can only be called by strategist or owner.
     *
     * Note: this is not an emergency withdraw function. For that, see panic().
     */
    function retireStrat() external {
        //todo get tokens, send to vault
    }

    /**
     * @dev Pauses supplied. Withdraws all funds from OxDao, leaving rewards behind.
     */
    function panic() external {
        _onlyStrategistOrOwner();
        //todo get tokens
        uint wantBalance = IERC20Upgradeable(want).balanceOf(address(this));
        IERC20Upgradeable(want).safeTransfer(vault, wantBalance);
        pause();
    }

    /**
     * @dev Unpauses the strat.
     */
    function unpause() external {
        _onlyStrategistOrOwner();
        _unpause();

        _giveAllowances();

        deposit();
    }

    /**
     * @dev Pauses the strat.
     */
    function pause() public {
        _onlyStrategistOrOwner();
        _pause();
        _removeAllowances();
    }

    /**
     * @dev Function that puts the funds to work.
     * It gets called whenever someone supplied in the strategy's vault contract.
     * It supplies {want} to the oxPool, then stakes it to farm {SOLID} and {OXD}
     */
    function deposit() public whenNotPaused {
        uint256 wantBalance = IERC20Upgradeable(want).balanceOf(address(this));
        if (wantBalance != 0) {
            IOxPool(oxPool).depositLp(wantBalance);
            IMultiRewards(stakingAddress).stake(wantBalance);
        }
    }

    /**
     * @dev Calculates the total amount of {want} held by the strategy
     * which is the balance of want + the total amount supplied to OxDao.
     */
    function balanceOf() public view override returns (uint) {
        return balanceOfWant() + balanceOfPool();
    }

    /**
     * @dev Calculates the total amount of {want} held in the 0xDao protocol
     */
    function balanceOfPool() public view returns (uint) {
    }

    /**
     * @dev Calculates the balance of want held directly by the strategy
     */
    function balanceOfWant() public view returns (uint) {
        return IERC20Upgradeable(want).balanceOf(address(this));
    }

    /**
     * @dev Core function of the strat, in charge of collecting and re-investing rewards.
     * 1. Claims {SOLID} and {OXD} from the OxDao.
     * 2. Swaps {SOLID} and {OXD} to {WFTM}.
     * 3. Claims fees for the harvest caller and treasury.
     * 4. Swaps the {WFTM} token for {want}
     * 5. Deposits.
     */
    function _harvestCore() internal override {
        _claimRewards();
        _swapRewardsToWftm();
        _chargeFees();
        _addLiquidity();
        deposit();
    }

    /**
     * @dev Core harvest function.
     * Get rewards from OxDao
     */
    function _claimRewards() internal {
    }

    /**
     * @dev Core harvest function.
     * Swaps {SOLID} and {OxDao} to {WFTM}
     */
    function _swapRewardsToWftm() internal {
       //todo
    }

    /**
     * @dev Core harvest function.
     * Charges fees based on the amount of WFTM gained from reward
     */
    function _chargeFees() internal {
        uint wftmFee = (IERC20Upgradeable(WFTM).balanceOf(address(this)) * totalFee) / PERCENT_DIVISOR;
        if (wftmFee != 0) {
            uint callFeeToUser = (wftmFee * callFee) / PERCENT_DIVISOR;
            uint treasuryFeeToVault = (wftmFee * treasuryFee) / PERCENT_DIVISOR;
            uint feeToStrategist = (treasuryFeeToVault * strategistFee) / PERCENT_DIVISOR;
            treasuryFeeToVault -= feeToStrategist;

            IERC20Upgradeable(WFTM).safeTransfer(msg.sender, callFeeToUser);
            IERC20Upgradeable(WFTM).safeTransfer(treasury, treasuryFeeToVault);
            IERC20Upgradeable(WFTM).safeTransfer(strategistRemitter, feeToStrategist);
        }
    }

    /** @dev Converts WFTM to both sides of the LP token and builds the liquidity pair */
    function _addLiquidity() internal {
        //todo
    }

    /**
     * @dev Gives the necessary allowances
     */
    function _giveAllowances() internal {
        // STAKED
        // WANT
        uint256 wantAllowance = type(uint).max - IERC20Upgradeable(want).allowance(address(this), oxPool);
        IERC20Upgradeable(want).safeIncreaseAllowance(
            oxPool,
            wantAllowance
        );

        // OXPOOL
        uint256 oxPoolAllowance = type(uint).max - IERC20Upgradeable(oxPool).allowance(address(this), stakingAddress);
        IERC20Upgradeable(oxPool).safeIncreaseAllowance(
            stakingAddress,
            oxPoolAllowance
        );

        // REWARDS
        // SOLID
        uint256 solidlyAllowance = type(uint).max - IERC20Upgradeable(SOLID).allowance(address(this), SOLIDLY_ROUTER);
        IERC20Upgradeable(SOLID).safeIncreaseAllowance(
            SOLIDLY_ROUTER,
            solidlyAllowance
        );
        solidlyAllowance = type(uint).max - IERC20Upgradeable(SOLID).allowance(address(this), SPOOKY_ROUTER);
        IERC20Upgradeable(SOLID).safeIncreaseAllowance(
            SPOOKY_ROUTER,
            solidlyAllowance
        );

        // OXD
        uint256 oxdAllowance = type(uint).max - IERC20Upgradeable(OXD).allowance(address(this), SOLIDLY_ROUTER);
        IERC20Upgradeable(OXD).safeIncreaseAllowance(
            SOLIDLY_ROUTER,
            oxdAllowance
        );
        oxdAllowance = type(uint).max - IERC20Upgradeable(OXD).allowance(address(this), SPOOKY_ROUTER);
        IERC20Upgradeable(OXD).safeIncreaseAllowance(
            SPOOKY_ROUTER,
            oxdAllowance
        );

        // INTERMEDIARY
        // WFTM
        uint256 wftmAllowance = type(uint).max - IERC20Upgradeable(WFTM).allowance(address(this), SOLIDLY_ROUTER);
        IERC20Upgradeable(WFTM).safeIncreaseAllowance(
            SOLIDLY_ROUTER,
            wftmAllowance
        );
        wftmAllowance = type(uint).max - IERC20Upgradeable(WFTM).allowance(address(this), SPOOKY_ROUTER);
        IERC20Upgradeable(WFTM).safeIncreaseAllowance(
            SPOOKY_ROUTER,
            wftmAllowance
        );

        // PAIR TOKENS
        // lpToken0
        uint256 lpToken0Allowance = type(uint).max - IERC20Upgradeable(lpToken0).allowance(address(this), SOLIDLY_ROUTER);
        IERC20Upgradeable(lpToken0).safeIncreaseAllowance(
            SOLIDLY_ROUTER,
            lpToken0Allowance
        );

        // lpToken1
        uint256 lpToken1Allowance = type(uint).max - IERC20Upgradeable(lpToken1).allowance(address(this), SOLIDLY_ROUTER);
        IERC20Upgradeable(lpToken1).safeIncreaseAllowance(
            SOLIDLY_ROUTER,
            lpToken1Allowance
        );
    }

    /**
     * @dev Removes all allowance that were given
     */
    function _removeAllowances() internal {
        IERC20Upgradeable(want).safeDecreaseAllowance(oxPool, IERC20Upgradeable(want).allowance(address(this), oxPool));
        IERC20Upgradeable(oxPool).safeDecreaseAllowance(stakingAddress, IERC20Upgradeable(oxPool).allowance(address(this), stakingAddress));

        IERC20Upgradeable(SOLID).safeDecreaseAllowance(SOLIDLY_ROUTER, IERC20Upgradeable(SOLID).allowance(address(this), SOLIDLY_ROUTER));
        IERC20Upgradeable(SOLID).safeDecreaseAllowance(SPOOKY_ROUTER, IERC20Upgradeable(SOLID).allowance(address(this), SPOOKY_ROUTER));
        
        IERC20Upgradeable(OXD).safeDecreaseAllowance(SOLIDLY_ROUTER, IERC20Upgradeable(OXD).allowance(address(this), SOLIDLY_ROUTER));
        IERC20Upgradeable(OXD).safeDecreaseAllowance(SPOOKY_ROUTER, IERC20Upgradeable(OXD).allowance(address(this), SPOOKY_ROUTER));

        IERC20Upgradeable(WFTM).safeDecreaseAllowance(SOLIDLY_ROUTER, IERC20Upgradeable(WFTM).allowance(address(this), SOLIDLY_ROUTER));
        IERC20Upgradeable(WFTM).safeDecreaseAllowance(SPOOKY_ROUTER, IERC20Upgradeable(WFTM).allowance(address(this), SPOOKY_ROUTER));

        IERC20Upgradeable(lpToken0).safeDecreaseAllowance(SOLIDLY_ROUTER, IERC20Upgradeable(lpToken0).allowance(address(this), SOLIDLY_ROUTER));
        IERC20Upgradeable(lpToken1).safeDecreaseAllowance(SOLIDLY_ROUTER, IERC20Upgradeable(lpToken1).allowance(address(this), SOLIDLY_ROUTER));
    }
}
