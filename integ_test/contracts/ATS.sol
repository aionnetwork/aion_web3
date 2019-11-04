pragma solidity 0.4.15;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 * @notice This is a softer (in terms of throws) variant of SafeMath:
 *         https://github.com/OpenZeppelin/openzeppelin-solidity/pull/1121
 */
library SafeMath {

    /**
    * @dev Multiplies two numbers, throws on overflow.
    */
    function mul(uint128 _a, uint128 _b) internal constant returns (uint128 c) {
        // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (_a == 0) {
            return 0;
        }
        c = _a * _b;
        require(c / _a == _b);
        return c;
    }

    /**
    * @dev Integer division of two numbers, truncating the quotient.
    */
    function div(uint128 _a, uint128 _b) internal constant returns (uint128) {
        // Solidity automatically throws when dividing by 0
        // therefore require beforehand avoid throw
        require(_b > 0);
        // uint128 c = _a / _b;
        // assert(_a == _b * c + _a % _b); // There is no case in which this doesn't hold
        return _a / _b;
    }

    /**
    * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint128 _a, uint128 _b) internal constant returns (uint128) {
        require(_b <= _a);
        return _a - _b;
    }

    /**
    * @dev Adds two numbers, throws on overflow.
    */
    function add(uint128 _a, uint128 _b) internal constant returns (uint128 c) {
        c = _a + _b;
        require(c >= _a);
        return c;
    }
}

interface ATS {
   
    /// Returns the name of the token
    function name() public constant returns (string);

    /// Returns the symbol of the token
    function symbol() public constant returns (string);
   
    /// Returns the totalSupply of the token, assuming a fixed number of
    /// token circulation, this number should not change.
    function totalSupply() public constant returns (uint128);

    /// Returns the currently liquid supply of the token, assuming a fixed
    /// number of (total) tokens are available, this number should never
    /// exceed the totalSupply() of the token.
    function liquidSupply() public constant returns (uint128);

    function balanceOf(address owner) public constant returns (uint128);

    function granularity() public constant returns (uint128);

    /// Default Operators removed, rationale behind this is that default operators
    /// Rationale behind this is that all operators should be (opt-in), this includes
    // function defaultOperators() public constant returns (address[]);
   
    function isOperatorFor(address operator, address tokenHolder) public constant returns (bool);
    function authorizeOperator(address operator) public;
    function revokeOperator(address operator) public;

    function send(address to, uint128 amount, bytes holderData) public;
    function operatorSend(address from, address to, uint128 amount, bytes holderData, bytes operatorData) public;

    /// Some functionality should still include a burn (for example slashing ERC20 tokens from a validator)
    function burn(uint128 amount, bytes holderData) public;
    function operatorBurn(address from, uint128 amount, bytes holderData, bytes operatorData) public;

    /// @notice Interface for a bridge/relay to execute a `send`
    /// @dev this name was suggested by Michael Kitchen, who suggested
    /// it makes sense to thaw an token from solid to liquid
    ///
    /// @dev function is called by foreign entity to `thaw` tokens
    /// to a particular user.
    function thaw(address localRecipient, uint128 amount, bytes32 bridgeId, bytes bridgeData, bytes32 remoteSender, bytes32 remoteBridgeId, bytes remoteData) public;    
   
    /// @notice Interface for a user to execute a `freeze`, which essentially
    /// is a functionality that locks the token (into the special address)
    ///
    /// @dev function is called by local user to `freeze` tokens thereby
    /// transferring them to another network.
    function freeze(bytes32 remoteRecipient, uint128 amount, bytes32 bridgeId, bytes localData) public;
    function operatorFreeze(address localSender, bytes32 remoteRecipient, uint128 amount, bytes32 bridgeId, bytes localData) public;

    /// Event to be emit at the time of contract creation. Rationale behind the event is a few things:
    ///
    /// * It allows one to filter for new ATS tokens being created, in the interest of clarity
    ///   this is a big help. We can simply filter for this event.
    ///
    /// * It indicates the `totalSupply` of the network. `totalSupply` is very important in
    ///   our standard, therefore it makes sense to include it as an emission.
    event Created(
        uint128 indexed     _totalSupply,
        /// This is a horrible name I know, up for debate
        address indexed     _creator);

    event Sent(
        address indexed     _operator,
        address indexed     _from,
        address indexed     _to,
        uint128             _amount,
        bytes               _holderData,
        bytes               _operatorData);

    event Thawed(
        address indexed localRecipient,
        uint128 amount,
        bytes32 indexed bridgeId,
        bytes bridgeData,
        bytes32 indexed remoteSender,
        bytes32 remoteBridgeId,
        bytes remoteData);

    event Froze(
        address indexed localSender,
        bytes32 indexed remoteRecipient,
        uint128 amount,
        bytes32 indexed bridgeId,
        bytes localData);

    event Minted(
        address indexed     _operator,
        address indexed     _to,
        uint128             _amount,
        bytes               _operatorData);

    event Burned(
        address indexed     _operator,
        address indexed     _from,
        uint128             _amount,
        bytes               _holderData,
        bytes               _operatorData);

    event AuthorizedOperator(
        address indexed     _Eoperator,
        address indexed     _tokenHolder);


    event RevokedOperator(
        address indexed     _operator,
        address indexed     _tokenHolder);
}

/**
 * @title ERC20 interface
 * @dev see https://github.com/aionnetwork/AIP/issues/4
 *
 * @notice ATS contracts by default are required to implement ERC20 interface
 */
contract ERC20 {
    function totalSupply() public constant returns (uint128);

    function balanceOf(address _who) public constant returns (uint128);

    function allowance(address _owner, address _spender) public constant returns (uint128);

    function transfer(address _to, uint128 _value) public returns (bool);

    function approve(address _spender, uint128 _value) public returns (bool);

    function transferFrom(address _from, address _to, uint128 _value) public returns (bool);

    event Transfer(
        address indexed from,
        address indexed to,
        uint128 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint128 value
    );
}


contract AionInterfaceRegistry {
    function getManager(address target) public constant returns(address);
    function setManager(address target, address manager) public;
    function getInterfaceDelegate(address target, bytes32 interfaceHash) public constant returns (address);
    function setInterfaceDelegate(address target, bytes32 interfaceHash, address delegate) public;
}

contract AionInterfaceImplementer {
    // TODO: this needs to be deployed, this is just a placeholder address
    AionInterfaceRegistry air = AionInterfaceRegistry(0xa0d270e7759e8fc020df5f1352bf4d329342c1bcdfe9297ef594fa352c7cab26);

    function setInterfaceDelegate(string _interfaceLabel, address impl) internal {
        bytes32 interfaceHash = sha3(_interfaceLabel);
        air.setInterfaceDelegate(this, interfaceHash, impl);
    }

    function getInterfaceDelegate(address addr, string _interfaceLabel) internal constant returns(address) {
        bytes32 interfaceHash = sha3(_interfaceLabel);
        return air.getInterfaceDelegate(addr, interfaceHash);
    }

    function setDelegateManager(address _newManager) internal {
        air.setManager(this, _newManager);
    }
}

interface ATSTokenRecipient {
    function tokensReceived(
        address operator,
        address from,
        address to,
        uint128 amount,
        bytes userData,
        bytes operatorData
    ) public;
}

interface ATSTokenSender {
    function tokensToSend(
        address operator,
        address from,
        address to,
        uint128 amount,
        bytes userData,
        bytes operatorData
    ) public;
}

/**
 * @title ATSImpl
 * @dev see https://github.com/qoire/ATS/blob/master/contracts/ATSImpl.sol
 *
 */

contract ATSImpl is ATS, ERC20, AionInterfaceImplementer {
    using SafeMath for uint128;

    /* -- Constants -- */

    address constant internal addressTypeMask = 0xFF00000000000000000000000000000000000000000000000000000000000000;
    address constant internal zeroAddress = 0x0000000000000000000000000000000000000000000000000000000000000000;

    /* -- ATS Contract State -- */

    string internal mName;
    string internal mSymbol;
    uint128 internal mGranularity;
    uint128 internal mTotalSupply;

    mapping(address => uint128) internal mBalances;
    mapping(address => mapping(address => bool)) internal mAuthorized;

    // for ERC20
    mapping(address => mapping(address => uint128)) internal mAllowed;


    /* -- Constructor -- */
    //
    /// @notice Constructor to create a ReferenceToken
   
    function ATSImpl() {
       
        mName = "BIM Token";
        mSymbol = "BIM";
        mTotalSupply = 100000000*10**18;
        mGranularity = 1;
require(mGranularity >= 1);
        initialize(mTotalSupply);

        // register onto CIR
        setInterfaceDelegate("AIP004Token", this);
    }

    function initialize(uint128 _totalSupply) internal {
        mBalances['0xa08dce6e051410810782981a00ccb6bb8695304b07eb8210db2beb4745656a48'] = _totalSupply;
        Created(_totalSupply, msg.sender);
    }

    /* -- ERC777 Interface Implementation -- */
    //
    /// @return the name of the token
    function name() public constant returns (string) { return mName; }

    /// @return the symbol of the token
    function symbol() public constant returns (string) { return mSymbol; }

    /// @return the granularity of the token
    function granularity() public constant returns (uint128) { return mGranularity; }

    /// @return the total supply of the token
    function totalSupply() public constant returns (uint128) { return mTotalSupply; }

    /// @notice Return the account balance of some account
    /// @param _tokenHolder Address for which the balance is returned
    /// @return the balance of `_tokenAddress`.
    function balanceOf(address _tokenHolder) public constant returns (uint128) { return mBalances[_tokenHolder]; }

    /// @notice Send `_amount` of tokens to address `_to` passing `_userData` to the recipient
    /// @param _to The address of the recipient
    /// @param _amount The number of tokens to be sent
    function send(address _to, uint128 _amount, bytes _userData) public {
        doSend(msg.sender, msg.sender, _to, _amount, _userData, "", true);

    }

    /// @notice Authorize a third party `_operator` to manage (send) `msg.sender`'s tokens.
    /// @param _operator The operator that wants to be Authorized
    function authorizeOperator(address _operator) public {
        require(_operator != msg.sender);
        mAuthorized[_operator][msg.sender] = true;
        AuthorizedOperator(_operator, msg.sender);
    }

    /// @notice Revoke a third party `_operator`'s rights to manage (send) `msg.sender`'s tokens.
    /// @param _operator The operator that wants to be Revoked
    function revokeOperator(address _operator) public {
        require(_operator != msg.sender);
        mAuthorized[_operator][msg.sender] = false;
        RevokedOperator(_operator, msg.sender);
    }

    /// @notice Check whether the `_operator` address is allowed to manage the tokens held by `_tokenHolder` address.
    /// @param _operator address to check if it has the right to manage the tokens
    /// @param _tokenHolder address which holds the tokens to be managed
    /// @return `true` if `_operator` is authorized for `_tokenHolder`
    function isOperatorFor(address _operator, address _tokenHolder) public constant returns (bool) {
        return (_operator == _tokenHolder || mAuthorized[_operator][_tokenHolder]);
    }

    /// @notice Send `_amount` of tokens on behalf of the address `from` to the address `to`.
    /// @param _from The address holding the tokens being sent
    /// @param _to The address of the recipient
    /// @param _amount The number of tokens to be sent
    /// @param _userData Data generated by the user to be sent to the recipient
    /// @param _operatorData Data generated by the operator to be sent to the recipient
    function operatorSend(address _from, address _to, uint128 _amount, bytes _userData, bytes _operatorData) public {
        require(isOperatorFor(msg.sender, _from));
        doSend(msg.sender, _from, _to, _amount, _userData, _operatorData, true);
    }

    function burn(uint128 _amount, bytes _holderData) public {
        doBurn(msg.sender, msg.sender, _amount, _holderData, "");
    }

    function operatorBurn(address _tokenHolder, uint128 _amount, bytes _holderData, bytes _operatorData) public {
        require(isOperatorFor(msg.sender, _tokenHolder));
        doBurn(msg.sender, _tokenHolder, _amount, _holderData, _operatorData);
    }

    /* -- Helper Functions -- */

    /// @notice Internal function that ensures `_amount` is multiple of the granularity
    /// @param _amount The quantity that want's to be checked
    function requireMultiple(uint128 _amount) internal constant {
        require(_amount.div(mGranularity).mul(mGranularity) == _amount);
    }

    /// @notice Check whether an address is a regular address or not.
    /// @param _addr Address of the contract that has to be checked
    /// @return `true` if `_addr` is a regular address (not a contract)
    ///
    /// Ideally, we should propose a better system that extcodesize
    ///
    /// *** TODO: CHANGE ME, going to require a resolution on best approach ***
    ///
    /// Given that we won't be able to detect code size.
    ///
    /// @param _addr The address to be checked
    /// @return `true` if the contract is a regular address, `false` otherwise
    function isRegularAddress(address _addr) internal constant returns (bool) {
        // if (_addr == 0) { return false; }
        // uint size;
        // assembly { size := extcodesize(_addr) }
        // return size == 0;
        return true;
    }

    /// @notice Helper function actually performing the sending of tokens.
    /// @param _operator The address performing the send
    /// @param _from The address holding the tokens being sent
    /// @param _to The address of the recipient
    /// @param _amount The number of tokens to be sent
    /// @param _userData Data generated by the user to be passed to the recipient
    /// @param _operatorData Data generated by the operator to be passed to the recipient
    /// @param _preventLocking `true` if you want this function to throw when tokens are sent to a contract not
    ///  implementing `erc777_tokenHolder`.
    ///  ERC777 native Send functions MUST set this parameter to `true`, and backwards compatible ERC20 transfer
    ///  functions SHOULD set this parameter to `false`.
    function doSend(
        address _operator,
        address _from,
        address _to,
        uint128 _amount,
        bytes _userData,
        bytes _operatorData,
        bool _preventLocking
    )
        internal
    {
        requireMultiple(_amount);

        callSender(_operator, _from, _to, _amount, _userData, _operatorData);

        require(_to != address(0));             // forbid sending to 0x0 (=burning)
        require(_to != address(this));          // forbid sending to the contract itself
        require(mBalances[_from] >= _amount);   // ensure enough funds

        mBalances[_from] = mBalances[_from].sub(_amount);
        mBalances[_to] = mBalances[_to].add(_amount);

        callRecipient(_operator, _from, _to, _amount, _userData, _operatorData, _preventLocking);

        Sent(_operator, _from, _to, _amount, _userData, _operatorData);
    }

    /// @notice Helper function actually performing the burning of tokens.
    /// @param _operator The address performing the burn
    /// @param _tokenHolder The address holding the tokens being burn
    /// @param _amount The number of tokens to be burnt
    /// @param _holderData Data generated by the token holder
    /// @param _operatorData Data generated by the operator
    function doBurn(address _operator, address _tokenHolder, uint128 _amount, bytes _holderData, bytes _operatorData)
        internal
    {
        requireMultiple(_amount);
        require(balanceOf(_tokenHolder) >= _amount);

        mBalances[_tokenHolder] = mBalances[_tokenHolder].sub(_amount);
        mTotalSupply = mTotalSupply.sub(_amount);

        callSender(_operator, _tokenHolder, 0x0, _amount, _holderData, _operatorData);
        Burned(_operator, _tokenHolder, _amount, _holderData, _operatorData);
    }

    /// @notice Helper function that checks for ERC777TokensRecipient on the recipient and calls it.
    ///  May throw according to `_preventLocking`
    /// @param _operator The address performing the send or mint
    /// @param _from The address holding the tokens being sent
    /// @param _to The address of the recipient
    /// @param _amount The number of tokens to be sent
    /// @param _userData Data generated by the user to be passed to the recipient
    /// @param _operatorData Data generated by the operator to be passed to the recipient
    /// @param _preventLocking `true` if you want this function to throw when tokens are sent to a contract not
    ///  implementing `ERC777TokensRecipient`.
    ///  ERC777 native Send functions MUST set this parameter to `true`, and backwards compatible ERC20 transfer
    ///  functions SHOULD set this parameter to `false`.
    function callRecipient(
        address _operator,
        address _from,
        address _to,
        uint128 _amount,
        bytes _userData,
        bytes _operatorData,
        bool _preventLocking
    )
        internal
    {
        address recipientImplementation = getInterfaceDelegate(_to, "AIP004TokenRecipient");
        if (recipientImplementation != 0) {
            ATSTokenRecipient(recipientImplementation).tokensReceived(
                _operator, _from, _to, _amount, _userData, _operatorData);
        } else if (_preventLocking) {
            require(isRegularAddress(_to));
        }
    }

    /// @notice Helper function that checks for ERC777TokensSender on the sender and calls it.
    ///  May throw according to `_preventLocking`
    /// @param _from The address holding the tokens being sent
    /// @param _to The address of the recipient
    /// @param _amount The amount of tokens to be sent
    /// @param _userData Data generated by the user to be passed to the recipient
    /// @param _operatorData Data generated by the operator to be passed to the recipient
    ///  implementing `ERC777TokensSender`.
    ///  ERC777 native Send functions MUST set this parameter to `true`, and backwards compatible ERC20 transfer
    ///  functions SHOULD set this parameter to `false`.
    function callSender(
        address _operator,
        address _from,
        address _to,
        uint128 _amount,
        bytes _userData,
        bytes _operatorData
    )
        internal
    {
        address senderImplementation = getInterfaceDelegate(_from, "AIP004TokenSender");
        if (senderImplementation == 0) { return; }
        ATSTokenSender(senderImplementation).tokensToSend(_operator, _from, _to, _amount, _userData, _operatorData);
    }

    function liquidSupply() public constant returns (uint128) {
        return mTotalSupply.sub(balanceOf(this));
    }


    /* -- Cross Chain Functionality -- */

    function thaw(
        address localRecipient,
        uint128 amount,
        bytes32 bridgeId,
        bytes bridgeData,
        bytes32 remoteSender,
        bytes32 remoteBridgeId,
        bytes remoteData)
    public {

    }

    function freeze(
        bytes32 remoteRecipient,
        uint128 amount,
        bytes32 bridgeId,
        bytes localData)
    public {

    }

    function operatorFreeze(address localSender,
        bytes32 remoteRecipient,
        uint128 amount,
        bytes32 bridgeId,
        bytes localData)
    public {

    }

    /* -- ERC20 Functionality -- */
   
    function decimals() public constant returns (uint8) {
        return uint8(18);
    }

    /// @param _to The address of the recipient
    /// @param _amount The number of tokens to be transferred
    /// @return `true`, if the transfer can't be done, it should fail.
    function transfer(address _to, uint128 _amount) public returns (bool success) {
        doSend(msg.sender, msg.sender, _to, _amount, "", "", false);
        return true;
    }

    /// @param _from The address holding the tokens being transferred
    /// @param _to The address of the recipient
    /// @param _amount The number of tokens to be transferred
    /// @return `true`, if the transfer can't be done, it should fail.
    function transferFrom(address _from, address _to, uint128 _amount) public returns (bool success) {
        require(_amount <= mAllowed[_from][msg.sender]);

        mAllowed[_from][msg.sender] = mAllowed[_from][msg.sender].sub(_amount);
        doSend(msg.sender, _from, _to, _amount, "", "", false);
        return true;
    }

    ///  `msg.sender` approves `_spender` to spend `_amount` tokens on its behalf.
    /// @param _spender The address of the account able to transfer the tokens
    /// @param _amount The number of tokens to be approved for transfer
    /// @return `true`, if the approve can't be done, it should fail.
    function approve(address _spender, uint128 _amount) public returns (bool success) {
        mAllowed[msg.sender][_spender] = _amount;
        Approval(msg.sender, _spender, _amount);
        return true;
    }

    ///  This function makes it easy to read the `allowed[]` map
    /// @param _owner The address of the account that owns the token
    /// @param _spender The address of the account able to transfer the tokens
    /// @return Amount of remaining tokens of _owner that _spender is allowed
    ///  to spend
    function allowance(address _owner, address _spender) public constant returns (uint128 remaining) {
        return mAllowed[_owner][_spender];
    }
}