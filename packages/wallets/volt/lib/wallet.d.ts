import { Polywallet, Utxo } from '@polywallet/core';
export declare class VoltWallet implements Polywallet.Wallet {
    readonly authenticateButtonOptions: Polywallet.AuthenticateButtonOptions;
    private isConnected;
    private volt;
    authenticate(): Promise<void>;
    isAuthenticated(): Promise<boolean>;
    getChangeOutputScript(): Promise<Uint8Array>;
    getSpendableBalance(): Promise<number>;
    sendToBitcoinAddress(destinationAddress: string, amountSatoshis: number): Promise<Utxo>;
    private authenticationGuard;
}
