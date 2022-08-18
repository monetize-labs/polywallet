import { AbstractSignatures, Polywallet, SignaturePair, Utxo } from '@polywallet/core';
export declare class SensiletWallet extends AbstractSignatures implements Polywallet.Wallet, Polywallet.Balance, Polywallet.Signatures {
    authenticateButtonOptions: Polywallet.AuthenticateButtonOptions;
    private isConnected;
    private sensilet?;
    authenticate(): Promise<void>;
    isAuthenticated(): Promise<boolean>;
    getChangeOutputScript(): Promise<Uint8Array>;
    sendToBitcoinAddress(destinationAddress: string, amountSatoshis: number): Promise<Utxo>;
    getSpendableBalance(): Promise<number>;
    getPublicKey(): Promise<Uint8Array>;
    sign(data: Uint8Array): Promise<SignaturePair>;
    private authenticationGuard;
    private extensionGuard;
}
