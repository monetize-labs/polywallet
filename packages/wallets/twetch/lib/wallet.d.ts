import { AbstractPaymailSignatures, Polywallet, SignaturePair, Utxo } from '@polywallet/core';
export declare class TwetchWallet extends AbstractPaymailSignatures implements Polywallet.Wallet, Polywallet.Signatures, Polywallet.Paymail {
    readonly authenticateButtonOptions: Polywallet.AuthenticateButtonOptions;
    private twetch?;
    authenticate(): Promise<void>;
    isAuthenticated(): Promise<boolean>;
    sendToBitcoinAddress(destinationAddress: string, amountSatoshis: number): Promise<Utxo>;
    getPaymail(): Promise<string>;
    sign(data: Uint8Array): Promise<SignaturePair>;
    private authenticationGuard;
    private extensionGuard;
}
