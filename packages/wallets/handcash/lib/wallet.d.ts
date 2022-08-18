import { AbstractPaymailSignatures, Polywallet, SignaturePair, Utxo } from '@polywallet/core';
export interface HandCashBuilderOptions {
    appId: string;
    appSecret: string;
}
export interface HandCashAuthenticationOptions {
    authToken: string;
    referrer?: string;
}
export declare class HandCashWallet extends AbstractPaymailSignatures implements Polywallet.Wallet, Polywallet.Balance, Polywallet.Signatures, Polywallet.Paymail, Polywallet.Encryption {
    readonly authenticateButtonOptions: Polywallet.AuthenticateButtonOptions;
    private account?;
    private connect;
    private encryptionPrivateKeyHex?;
    private encryptionPublicKeyHex?;
    constructor(options: HandCashBuilderOptions);
    authenticate(options?: HandCashAuthenticationOptions): Promise<void>;
    isAuthenticated(): Promise<boolean>;
    getSpendableBalance(): Promise<number>;
    sendToBitcoinAddress(destinationAddress: string, amountSatoshis: number): Promise<Utxo>;
    getPaymail(): Promise<string>;
    sign(data: Uint8Array): Promise<SignaturePair>;
    encrypt(data: Uint8Array): Promise<Uint8Array>;
    decrypt(data: Uint8Array): Promise<Uint8Array>;
    private fetchEncryptionKeyPair;
    private authenticationGuard;
}
