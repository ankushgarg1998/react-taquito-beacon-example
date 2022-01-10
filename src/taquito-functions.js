import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';

const appName = 'Test App';
const rpcNode = 'https://hangzhounet.smartpy.io';
const networkName = 'hangzhounet';
const networkObject = {
    network: {
        type: networkName
    }
};
const plentyTokenDecimal = 18;
const plentyContractAddress = 'KT1UxiNpP1KXCJs4iTtawEE5V3FpRbHNxY2Q';

// This function fetches plenty balance of any address for you.
export const fetchPlentyBalanceOfUser = async (userAddress) => {
    try {
        const Tezos = new TezosToolkit(rpcNode);
        Tezos.setProvider(rpcNode);

        let userBalance = 0;
        const plentyContractInstance = await Tezos.contract.at(plentyContractAddress);
        const storageInstance = await plentyContractInstance.storage();
        const userDetails = await storageInstance.balances.get(userAddress);
        userBalance = userDetails.balance;
        userBalance = (userBalance.toNumber() / Math.pow(10, plentyTokenDecimal)).toFixed(3);

        return {
            success: true,
            userBalance,
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            userBalance: 0,
        };
    }
};

// This function checks if the wallet is connected with app to perform any operation.
const CheckIfWalletConnected = async (wallet) => {
    try {
        const activeAccount = await wallet.client.getActiveAccount();
        if (!activeAccount) {
            await wallet.client.requestPermissions(networkObject);
        }
        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            error,
        };
    }
};

// This function helps you transfer plenty from you account to other account.
export const transferPlenty = async (amount, payerAddress) => {
    try {
        const wallet = new BeaconWallet({ name: appName });
        const WALLET_RESP = await CheckIfWalletConnected(wallet);

        if (WALLET_RESP.success) {
            const account = await wallet.client.getActiveAccount();
            const userAddress = account.address;
            const Tezos = new TezosToolkit(rpcNode);
            Tezos.setRpcProvider(rpcNode);
            Tezos.setWalletProvider(wallet);
            const plentyContractInstance = await Tezos.contract.at(plentyContractAddress);
            const transferAmount = Math.floor(amount * Math.pow(10, plentyTokenDecimal));

            let batch = await Tezos.wallet
                .batch()
                .withContractCall(
                    plentyContractInstance.methods.transfer(userAddress, payerAddress, transferAmount)
                );
            const batchOperation = await batch.send();
            await batchOperation.confirmation();

            return {
                success: true,
                opID: batchOperation.opHash,
            };
        }
    } catch (err) {
        console.log(err);
        return {
            success: false,
            opID: null,
        };
    }
};


// This function helps you mint plenty from you account to other account.
export const mintPlenty = async (minInAddress, amount) => {
    try {
        const wallet = new BeaconWallet({ name: appName });
        const WALLET_RESP = await CheckIfWalletConnected(wallet);

        if (WALLET_RESP.success) {
            const account = await wallet.client.getActiveAccount();
            const userAddress = account.address;
            const Tezos = new TezosToolkit(rpcNode);
            Tezos.setRpcProvider(rpcNode);
            Tezos.setWalletProvider(wallet);
            const plentyContractInstance = await Tezos.contract.at(plentyContractAddress);
            const mintAmount = Math.floor(amount * Math.pow(10, plentyTokenDecimal));

            let batch = await Tezos.wallet
                .batch()
                .withContractCall(
                    plentyContractInstance.methods.mint(minInAddress, mintAmount)
                );
            const batchOperation = await batch.send();
            await batchOperation.confirmation();

            return {
                success: true,
                opID: batchOperation.opHash,
            };
        }
    } catch (err) {
        console.log(err);
        return {
            success: false,
            opID: null,
        };
    }
};

export const getTotalSupply = async () => {
    try {
        const Tezos = new TezosToolkit(rpcNode);
        Tezos.setRpcProvider(rpcNode);
        const plentyContractInstance = await Tezos.contract.at(plentyContractAddress);
        const contractStorage = await plentyContractInstance.storage();
        const totalSupply = (contractStorage.totalSupply / Math.pow(10, plentyTokenDecimal));
        return {
            success: true,
            totalSupply
        };
    } catch (err) {
        console.log(err);
    }
};