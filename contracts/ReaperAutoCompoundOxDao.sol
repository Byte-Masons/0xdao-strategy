// SPDX-License-Identifier: MIT

import './abstract/ReaperBaseStrategy.sol';
import './interfaces/IUniswapRouter.sol';
import './interfaces/IMasterChef.sol';
import './interfaces/IUniswapV2Pair.sol';
import './interfaces/IUniswapV2Router02.sol';
import './interfaces/IOxPool.sol';
import './interfaces/IOxLens.sol';
import './interfaces/IBaseV1Router01.sol';
import './interfaces/IBaseV1Pair.sol';
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

pragma solidity 0.8.11;

/**
 * @dev This strategy will farm LPs on OxDao and autocompound rewards
 */
contract ReaperAutoCompoundOxDao is ReaperBaseStrategy {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    // Wrapper struct to encapsulate a UniRouter swap path + the best router for it
    struct SwapInfo {
        address[] path;
        address router;
    }

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
     * {SPIRIT_ROUTER} - Backup router for swapping illiquid pairs
     * {OXLENS} - Primary view interface for OxDao
     */
    address public constant SOLIDLY_ROUTER = 0xa38cd27185a464914D3046f0AB9d43356B34829D;
    address public constant SPIRIT_ROUTER = 0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52;
    address public constant OXLENS = 0xDA00137c79B30bfE06d04733349d98Cf06320e69;

    /**
    * @dev OxDao variables
    * {oxPool} - OxDao pool for the want. OxPools represent a 1:1 ERC20 wrapper of a Solidly LP token
    * {stakingAddress} - Staking address for the pool
    * {relayToken} - Token used for liquidity swaps
    */
    address public oxPool;
    address public stakingAddress;
    address public relayToken;

    /**
     * @dev tokenA => (tokenB => swapPath config): returns best path + router to swap
     *      tokenA to tokenB
     */
    mapping(address => mapping(address => SwapInfo)) public swapInfo;

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
        relayToken = lpToken0;
    }

    /**
     * @dev Update {SwapInfo} for a specified pair of tokens.
     */
    function updateSwapInfo(address _tokenIn, address _tokenOut, address _router, address[] calldata _path) external {
        _onlyStrategistOrOwner();
        swapInfo[_tokenIn][_tokenOut] = SwapInfo({path: _path, router: _router});
    }

    /**
     * @dev Withdraws funds and sents them back to the vault.
     * It unstakes {want} and withdraws it from OxDao
     * The available {want} minus fees is returned to the vault.
     */
    function withdraw(uint _withdrawAmount) external {
        require(msg.sender == vault, "!vault");

        uint256 wantBalance = balanceOfWant();

        if (wantBalance < _withdrawAmount) {
            IMultiRewards(stakingAddress).withdraw(_withdrawAmount - wantBalance);
            IOxPool(oxPool).withdrawLp(_withdrawAmount - wantBalance);
            wantBalance = balanceOfWant();
        }

        if (wantBalance > _withdrawAmount) {
            wantBalance = _withdrawAmount;
        }

        uint256 withdrawFee = (wantBalance * securityFee) / PERCENT_DIVISOR;
        IERC20Upgradeable(want).safeTransfer(vault, wantBalance - withdrawFee);
    }

    /**
     * @dev Returns the approx amount of profit from harvesting.
     *      Profit is denominated in WFTM, and takes fees into account.
     */
    function estimateHarvest() external view override returns (uint profit, uint callFeeToUser) {
        // Tentative reward estimation, need more insight into the multireward view functions
        uint256 solidRewards = IMultiRewards(stakingAddress).earned(address(this), SOLID);
        uint256 oxdRewards = IMultiRewards(stakingAddress).earned(address(this), OXD);

        IBaseV1Router01 router = IBaseV1Router01(SOLIDLY_ROUTER);
        (uint256 fromSolid, ) = router.getAmountOut(solidRewards, SOLID, WFTM);
        profit += fromSolid;
        (uint256 fromOxd, ) = router.getAmountOut(oxdRewards, OXD, WFTM);
        profit += fromOxd;

        uint256 wftmFee = (profit * totalFee) / PERCENT_DIVISOR;
        callFeeToUser = (wftmFee * callFee) / PERCENT_DIVISOR;
        profit -= wftmFee;
    }

    /**
     * @dev Function to retire the strategy. Claims all rewards and withdraws
     *      all principal from external contracts, and sends everything back to
     *      the vault. Can only be called by strategist or owner.
     *
     * Note: this is not an emergency withdraw function. For that, see panic().
     */
    function retireStrat() external {
        _onlyStrategistOrOwner();

        IMultiRewards(stakingAddress).exit();
        IOxPool(oxPool).withdrawLp(IOxPool(oxPool).balanceOf(address(this)));

        _swapRewardsToWftm();
        _addLiquidity();

        uint256 wantBal = balanceOfWant();
        IERC20Upgradeable(want).safeTransfer(vault, wantBal);
    }

    /**
     * @dev Pauses supplied. Withdraws all funds from OxDao, leaving rewards behind.
     */
    function panic() external {
        _onlyStrategistOrOwner();
        IMultiRewards(stakingAddress).exit();
        IOxPool(oxPool).withdrawLp(IOxPool(oxPool).balanceOf(address(this)));
        pause();
    }

    /**
     * @dev Unpauses the strat.
     */
    function unpause() external {
        _onlyStrategistOrOwner();
        _unpause();
        deposit();
    }

    /**
     * @dev Pauses the strat.
     */
    function pause() public {
        _onlyStrategistOrOwner();
        _pause();
    }

    /**
     * @dev Function that puts the funds to work.
     * It gets called whenever someone supplied in the strategy's vault contract.
     * It supplies {want} to the oxPool, then stakes it to farm {SOLID} and {OXD}
     */
    function deposit() public whenNotPaused {
        uint256 wantBalance = IERC20Upgradeable(want).balanceOf(address(this));
        if (wantBalance != 0) {
            IERC20Upgradeable(want).safeIncreaseAllowance(oxPool, wantBalance);
            IOxPool(oxPool).depositLp(wantBalance);

            IERC20Upgradeable(oxPool).safeIncreaseAllowance(stakingAddress, wantBalance);
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
     * No need to check the balance inside oxPool as it is always sent to the stakingAddress
     */
    function balanceOfPool() public view returns (uint) {
        return IMultiRewards(stakingAddress).balanceOf(address(this));
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
        IMultiRewards(stakingAddress).getReward();
    }

    /**
     * @dev Core harvest function.
     * Swaps {SOLID} and {OxDao} to {WFTM}
     */
    function _swapRewardsToWftm() internal {
       uint256 solidBalance = IERC20Upgradeable(SOLID).balanceOf(address(this));
       uint256 oxdBalance = IERC20Upgradeable(OXD).balanceOf(address(this));

       _swapTokens(SOLID, WFTM, solidBalance);
       _swapTokens(OXD, WFTM, oxdBalance);
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
        uint256 wftmBalance = IERC20Upgradeable(WFTM).balanceOf(address(this));
        if (wftmBalance == 0) {
            return;
        }

        // full WFTM -> DEUS, then half DEUS to DEI
        _swapTokens(WFTM, lpToken1, wftmBalance);
        _swapTokens(lpToken1, lpToken0, IERC20Upgradeable(lpToken1).balanceOf(address(this)) / 2);

        uint256 lpToken0Bal = IERC20Upgradeable(lpToken0).balanceOf(address(this));
        uint256 lpToken1Bal = IERC20Upgradeable(lpToken1).balanceOf(address(this));

        IERC20Upgradeable(lpToken0).safeIncreaseAllowance(SOLIDLY_ROUTER, lpToken0Bal);
        IERC20Upgradeable(lpToken1).safeIncreaseAllowance(SOLIDLY_ROUTER, lpToken1Bal);
        IBaseV1Router01(SOLIDLY_ROUTER).addLiquidity(
            lpToken0,
            lpToken1,
            IBaseV1Pair(want).stable(),
            lpToken0Bal,
            lpToken1Bal,
            0,
            0,
            address(this),
            block.timestamp
        );
    }

    /**
     * @dev Helper function to swap tokens using {SwapInfo}. Also writes {SwapInfo} if none is found.
     */
    function _swapTokens(
        address _from,
        address _to,
        uint256 _amount
    ) internal {
        if (_from == _to || _amount == 0) {
            return;
        }

        SwapInfo storage si = swapInfo[_from][_to];
        if (si.path.length == 0 || si.router == address(0)) {
            delete(si.path);
            si.path.push(_from);
            si.path.push(_to);
            uint256 fromSolid = 0;
            uint256 fromSpirit = 0;

            try IBaseV1Router01(SOLIDLY_ROUTER).getAmountOut(_amount, _from, _to) returns (uint256 amount, bool) {
                fromSolid = amount;
            } catch {}
            try IUniswapV2Router02(SPIRIT_ROUTER).getAmountsOut(_amount, si.path) returns (uint256[] memory amounts) {
                fromSpirit = amounts[si.path.length - 1];
            } catch {}
            si.router = fromSolid > fromSpirit ? SOLIDLY_ROUTER : SPIRIT_ROUTER;
        }

        IERC20Upgradeable(_from).safeIncreaseAllowance(si.router, _amount);
        if (si.router == SOLIDLY_ROUTER) {
            IBaseV1Router01 router = IBaseV1Router01(si.router);
            IBaseV1Router01.route[] memory routes = new IBaseV1Router01.route[](si.path.length - 1);
            uint256 prevRouteOutput = _amount;
            for (uint256 i = 0; i < routes.length; i++) {
                (uint256 output, bool useStable) = router.getAmountOut(prevRouteOutput, si.path[i], si.path[i + 1]);
                routes[i] = IBaseV1Router01.route({from: si.path[i], to: si.path[i + 1], stable: useStable});
                prevRouteOutput = output;
            }
            router.swapExactTokensForTokens(_amount, 0, routes, address(this), block.timestamp);
        } else {
            IUniswapV2Router02(si.router).swapExactTokensForTokensSupportingFeeOnTransferTokens(
                _amount,
                0,
                si.path,
                address(this),
                block.timestamp
            );
        }
    }
}
