import { BeaconWallet } from '@taquito/beacon-wallet';

const appName = 'Test App';
const networkName = 'hangzhounet';
const networkObject = {
    network: {
        type: networkName
    }
};
const beaconWalletOptions = { name: appName };
const getWalletResponse = (success, walletAddress, error) => {
    return {
        success,
        wallet: walletAddress,
        error
    }
};

// Connects wallet with APP
export const ConnectWalletAPI = async () => {
    try {
        const wallet = new BeaconWallet(beaconWalletOptions);
        let account = await wallet.client.getActiveAccount();

        if (!account) {
            await wallet.client.requestPermissions(networkObject);
            account = await wallet.client.getActiveAccount();
        }

        return getWalletResponse(true, account.address, null);
    } catch (error) {
        return getWalletResponse(false, null, error);
    }
};

// Disconnects wallet with App
export const DisconnectWalletAPI = async () => {
    try {
        const wallet = new BeaconWallet(beaconWalletOptions);
        await wallet.disconnect();

        return getWalletResponse(true, null, null);
    } catch (error) {
        return getWalletResponse(false, null, error);
    }
};

// Checks if wallet is already connected and provides connected wallet address
export const FetchWalletAPI = async () => {
    try {
        const wallet = new BeaconWallet(beaconWalletOptions);
        let account = await wallet.client.getActiveAccount();

        if (!account) {
            return getWalletResponse(false, null, null);
        }
        return getWalletResponse(true, account.address, null);
    } catch (error) {
        return getWalletResponse(false, null, error);
    }
};
