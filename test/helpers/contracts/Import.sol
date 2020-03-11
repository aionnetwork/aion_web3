pragma solidity ^0.4.15;

import "Ticker.sol";
import "Wallet.sol";

contract Importer {

    Ticker t;
    Wallet w;

    function f(address addr) {
	uint128 num = t.getTicker();
        suicide(addr);
    }
}
