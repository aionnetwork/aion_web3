package atsToken;

import avm.Address;
import avm.Blockchain;
import org.aion.avm.tooling.abi.Callable;
import org.aion.avm.userlib.AionBuffer;
import org.aion.avm.userlib.abi.ABIDecoder;

import java.math.BigInteger;

public class ATSTokenContract {

    /***********************************************Constants***********************************************/
    private static final int BIGINTEGER_LENGTH = 32;


    /**************************************Deployment Initialization***************************************/

    private static String tokenName;

    private static String tokenSymbol;

    private static int tokenGranularity;

    private static BigInteger tokenTotalSupply;

    static {



        tokenName = "JENNIJUJU";
        Blockchain.require(tokenName.length() > 0);
        tokenSymbol = "J3N";
        Blockchain.require(tokenSymbol.length() > 0);
        tokenGranularity = 1;
        Blockchain.require(tokenGranularity >= 1);
        tokenTotalSupply = BigInteger.valueOf(3).multiply(BigInteger.valueOf(1_000_000_000_000_000_000L));
        Blockchain.require(tokenTotalSupply.compareTo(BigInteger.ZERO) == 1);

        initialize();
        
        Blockchain.log(hexStringToByteArray(
                "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111" +
                "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111" +
                "111111888888111111cd8888bc111111888b11118881111111cd8888bc111cd88888bc188888881888b111188811111111" +
                "11111111788b11111d88711188b111118888b111888111111d88711188b1d887717188b118881118888b11188811111111" +
                "1111111118881111111111cd8871111188888b1188811111188811118881888111118881188811188888b1188811111111" +
                "11111111188811111111188887111111888188b1888111111888111111118881111188811888111888188b188811111111" +
                "1111111118881111111111718bc111118881188b8881111118881111111188811111888118881118881188b88811111111" +
                "11111111188811111888111188811111888111888881111118881111888188811111888118881118881118888811111111" +
                "11111111188711111188b11d8871111188811118888111111188b11d8871188bc1cd887118881118881111888811111111" +
                "11111111188811111171888877111111888111118881111111718888771117188888771888888818881111188811111111" +
                "1111111cd88711111111111111111111111111111111111111111111111111111111111111111111111111111111111111" +
                "11111cd8877111111111111111111111111111111111111111111111111111111111111111111111111111111111111111" +
                "11118887711111111111111111111111111111111111111111111111111111111111111111111111111111111111111111" +
                "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111" +
                "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111" +
                "111111111111111111111111111111111888888bc11111111788b111d88711111111111111111111111111111111111111" +
                "11111111111111111111111111111111188811788b11111111788b1d887111111111111111111111111111111111111111" +
                "11111111111111111111111111111111188811c887111111111788o8871111111111111111111111111111111111111111" +
                "1111111111111111111111111111111118888888c111111111178887111111111111111111111111111111111111111111" +
                "111111111111111111111111111111111888117788b1111111111888111111111111111111111111111111111111111111" +
                "11111111111111111111111111111111188811118881111111111888111111111111111111111111111111111111111111" +
                "11111111111111111111111111111111188888887711111111111888111111111111111111111111111111111111111111" +
                "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111" +
                "11111111888888188888888881888b11118881888b11118881888888818888881888111118881888888188811111888111" +
                "1111111788b1888111111118888b11188818888b11188811188811111788b188811111888111788b188811111888111111" +
                "1111111188818881111111188888b11888188888b118881118881111118881888111118881111888188811111888111111" +
                "11111111888188888881111888788b18881888788b18881118881111118881888111118881111888188811111888111111" +
                "111111118881888111111118881788b88818881788b8881118881111118881888111118881111888188811111888111111" +
                "11111111888188811111111888117888881888117888881118881111118881888111118881111888188811111888111111" +
                "11111111887188811111111888111788881888111788881118881111118871788bc1cd88711118871788bc1cd887111111" +
                "11111111888188888888881888111178881888111178881888888811118881177888887711111888117788888771111111" +
                "111111cd887111111111111111111111111111111111111111111111cd88711111111111111cd887111111111111111111" +
                "1111cd887711111111111111111111111111111111111111111111cd88771111111111111cd88771111111111111111111" +
                "11188877111111111111111111111111111111111111111111111888771111111111111188877111111111111111111111" +
                "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111"));

        //ToDo: Register in the AIR
    }


    /********************************************Initialization********************************************/
    /**
     * The creator of the token contract holds the total supply.
     * Log the token creation.
     */
    private static void initialize() {
        Blockchain.putStorage(Blockchain.getCaller().toByteArray(), AionBuffer.allocate(BIGINTEGER_LENGTH).put32ByteInt(tokenTotalSupply).getArray());
        ATSTokenContractEvents.ATSTokenCreated(tokenTotalSupply, Blockchain.getCaller());
    }


    /**********************************************Token Info**********************************************/

    @Callable
    public static String name() {
        return tokenName;
    }

    @Callable
    public static String symbol() {
        return tokenSymbol;
    }

    @Callable
    public static int granularity() {
        return tokenGranularity;
    }

    @Callable
    public static byte[] totalSupply() {
        return tokenTotalSupply.toByteArray();
    }

    /*********************************************Token Holder*********************************************/
    /**
     * Return balance in String to make it human readable.
     *
     * @param tokenHolder
     * @return
     */
    @Callable
    public static byte[] balanceOf(Address tokenHolder) {
        byte[] tokenHolderInformation = Blockchain.getStorage(tokenHolder.toByteArray());
        return (tokenHolderInformation != null)
                ? AionBuffer.wrap(tokenHolderInformation).get32ByteInt().toByteArray()
                : new byte[0];
    }

    @Callable
    public static void authorizeOperator(Address operator) {

        //Should not assign token holder itself to be the operator. Quickly revert the tx to save energy.
        Blockchain.require(!Blockchain.getCaller().equals(operator));

        Address tokenHolderAddress = Blockchain.getCaller();
        byte[] tokenHolderInformationBytes = Blockchain.getStorage(tokenHolderAddress.toByteArray());
        if (tokenHolderInformationBytes == null ) { /*No related information yet.
                                                    Add balance as 0 first to make sure first 32 bytes of token holder information is balance.
                                                    Set number of operators to 1.
                                                    Following by the operator.*/
            byte[] newInformation = AionBuffer.allocate(BIGINTEGER_LENGTH + Address.LENGTH)
                    .put32ByteInt(BigInteger.ZERO)
                    .putAddress(operator)
                    .getArray();
            Blockchain.putStorage(tokenHolderAddress.toByteArray(), newInformation);
            ATSTokenContractEvents.AuthorizedOperator(operator, tokenHolderAddress);
        } else {
            TokenHolderInformation tokenHolder = new TokenHolderInformation(tokenHolderInformationBytes);
            boolean addOperatorSuccess = tokenHolder.tryAddOperator(operator);
            if(addOperatorSuccess) {
                Blockchain.putStorage(tokenHolderAddress.toByteArray(), tokenHolder.currentTokenHolderInformation);
                ATSTokenContractEvents.AuthorizedOperator(operator, tokenHolderAddress);
            }
        }
    }

    @Callable
    public static void revokeOperator(Address operator) {
        if (!Blockchain.getCaller().equals(operator)) {
            Address tokenHolderAddress = Blockchain.getCaller();
            byte[] tokenHolderInformation = Blockchain.getStorage(tokenHolderAddress.toByteArray());
            if(tokenHolderInformation != null && tokenHolderInformation.length > BIGINTEGER_LENGTH) {
                TokenHolderInformation tokenHolder = new TokenHolderInformation(tokenHolderInformation);
                boolean tryRevokeOperator = tokenHolder.tryReveokeOperator(operator);
                if(tryRevokeOperator) {
                    Blockchain.putStorage(tokenHolderAddress.toByteArray(), tokenHolder.currentTokenHolderInformation);
                    ATSTokenContractEvents.RevokedOperator(operator, tokenHolderAddress);
                }
            }
        }
    }

    @Callable
    public static boolean isOperatorFor(Address operator, Address tokenHolder) {
        if (operator.equals(tokenHolder)) {
            return true;
        }
        byte[] tokenHolderInformation = Blockchain.getStorage(tokenHolder.toByteArray());
        if(tokenHolderInformation != null && tokenHolderInformation.length > BIGINTEGER_LENGTH) {
            TokenHolderInformation tokenHolderInfo = new TokenHolderInformation(tokenHolderInformation);
            return tokenHolderInfo.isOperatorFor(operator,tokenHolderInformation);
        } else {
            return false;
        }

    }

    /******************************************Token Movement*******************************************/
    @Callable
    public static void send(Address to, byte[] amount, byte[] userData) {
        doSend(Blockchain.getCaller(), Blockchain.getCaller(), to, new BigInteger(amount), userData, new byte[0], true);
    }

    @Callable
    public static void operatorSend(Address from, Address to, byte[] amount, byte[] userData, byte[] operatorData) {
        Blockchain.require(isOperatorFor(Blockchain.getCaller(),from));
        doSend(Blockchain.getCaller(), from, to, new BigInteger(amount), userData, operatorData, true);
    }

    @Callable
    public static void burn(byte[] amount, byte[] holderData) {
        doBurn(Blockchain.getCaller(),Blockchain.getCaller(), new BigInteger(amount) ,holderData, new byte[0]);
    }

    @Callable
    public static void operatorBurn(Address tokenHolder, byte[] amount, byte[] holderData, byte[] operatorData) {
        Blockchain.require(isOperatorFor(Blockchain.getCaller(), tokenHolder));
        doBurn(Blockchain.getCaller(), tokenHolder, new BigInteger(amount), holderData, new byte[0]);
    }
    private static void doSend(Address operator, Address from, Address to, BigInteger amount, byte[] userData, byte[] operatorData, boolean preventLocking) {
        Blockchain.require(amount.compareTo(BigInteger.ZERO) >= -1);
        Blockchain.require(amount.mod(BigInteger.valueOf(tokenGranularity)).equals(BigInteger.ZERO));
        callSender(operator, from, to, amount, userData, operatorData);
        Blockchain.require(!to.equals(new Address(new byte[32]))); //forbid sending to 0x0 (=burning)
        Blockchain.require(!to.equals(Blockchain.getAddress())); //forbid sending to this contract


        byte[] fromTokenHolderInformation = Blockchain.getStorage(from.toByteArray());
        Blockchain.require(fromTokenHolderInformation != null); //No information at all means no balance, revert tx
        TokenHolderInformation fromInfo = new TokenHolderInformation(fromTokenHolderInformation);
        Blockchain.require(fromInfo.getBalanceOf().compareTo(amount) >= -1); //`from` doesnt have enough balance,
        // revert tx
        fromInfo.updateBalance(fromInfo.getBalanceOf().subtract(amount));
        Blockchain.putStorage(from.toByteArray(),fromInfo.currentTokenHolderInformation);


        byte[] toTokenHolderInformation = Blockchain.getStorage(to.toByteArray());
        if(toTokenHolderInformation == null) {

            Blockchain.putStorage(to.toByteArray(),
                                    AionBuffer.allocate(BIGINTEGER_LENGTH).put32ByteInt(amount).getArray());
            callRecipient(operator, from, to, amount, userData, operatorData, preventLocking);
            ATSTokenContractEvents.Sent(operator, from, to, amount, userData, operatorData);
        } else {

            TokenHolderInformation toInfo = new TokenHolderInformation(Blockchain.getStorage(to.toByteArray()));
            toInfo.updateBalance(toInfo.getBalanceOf().add(amount));
            Blockchain.putStorage(to.toByteArray(), toInfo.currentTokenHolderInformation);
            callRecipient(operator, from, to, amount, userData, operatorData, preventLocking);
            ATSTokenContractEvents.Sent(operator, from, to, amount, userData, operatorData);
        }
    }

    private static void doBurn(Address operator, Address tokenHolder, BigInteger amount, byte[] holderData,
                               byte[] operatorData) {
        Blockchain.require(amount.compareTo(BigInteger.ZERO) >= -1);
        Blockchain.require(amount.mod(BigInteger.valueOf(tokenGranularity)).equals(BigInteger.ZERO));
        byte[] tokenHolderInformation = Blockchain.getStorage(tokenHolder.toByteArray());
        Blockchain.require(tokenHolderInformation != null);
        TokenHolderInformation tokenhHolderInfo = new TokenHolderInformation(tokenHolderInformation);
        Blockchain.require(tokenhHolderInfo.getBalanceOf().compareTo(amount) >= -1);
        tokenhHolderInfo.updateBalance(tokenhHolderInfo.getBalanceOf().subtract(amount));
        Blockchain.putStorage(tokenHolder.toByteArray(),tokenhHolderInfo.currentTokenHolderInformation);
        //Todo: test on real network
        tokenTotalSupply = tokenTotalSupply.subtract(amount);

        callSender(operator, tokenHolder, new Address(new byte[32]), amount, holderData, operatorData);
        ATSTokenContractEvents.Burned(operator, tokenHolder, amount, holderData, operatorData);
    }

    //ToDO: register to AIR
    private static void callSender(Address operator, Address from, Address to, BigInteger amount, byte[] userData, byte[] operatorData) {

    }

    //ToDO: register to AIR
    private static void callRecipient(Address operator, Address from, Address to, BigInteger amount, byte[] userData, byte[] operatorData, boolean preventLocking) {

    }

    private static boolean isRegularAccount(Address address) {
        return (Blockchain.getCodeSize(address) > 0) ? true : false;
    }


    /*********************************************Cross Chain *******************************************/
    @Callable
    public static void thaw (Address localRecipient, byte[] amount, byte[] bridgeId, byte[] bridgeData,
                             byte[] remoteSender, byte[] remoteBridgeId, byte[] remoteData) {
    }

    @Callable
    public static void freeze(byte[] remoteRecipient, byte[] amount, byte[] bridgeId, byte[] localData) {
    }

    @Callable
    public static void operatorFreeze(Address localSender, byte[] remoteRecipient, byte[] amount, byte[] bridgeId,
                                      byte[] localData) {
    }


    @Callable
    public static byte[] getLiquidSupply() {
        return tokenTotalSupply.subtract(new BigInteger(balanceOf(Blockchain.getAddress()))).toByteArray();
    }


    private static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }
}




