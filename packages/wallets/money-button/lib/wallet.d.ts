import { AbstractPaymailSignatures, Polywallet, SignaturePair, Utxo } from '@polywallet/core';
export interface MoneyButtonBuilderOptions {
    clientIdentifier: string;
    minimumAmount?: number;
    suggestedAmount?: number;
}
export declare class MoneyButtonWallet extends AbstractPaymailSignatures implements Polywallet.Wallet, Polywallet.Balance, Polywallet.Signatures, Polywallet.Paymail, Polywallet.Encryption {
    readonly authenticateButtonOptions: Polywallet.AuthenticateButtonOptions;
    private clientIdentifier;
    private invisibleMoneyButton?;
    private minimumAmount;
    private suggestedAmount;
    constructor(options: MoneyButtonBuilderOptions);
    private loadScript;
    authenticate(): Promise<void>;
    isAuthenticated(): Promise<boolean>;
    getSpendableBalance(): Promise<number>;
    sendToBitcoinAddress(destinationAddress: string, amountSatoshis: number): Promise<Utxo>;
    getPaymail(): Promise<string>;
    sign(data: Uint8Array): Promise<SignaturePair>;
    encrypt(data: Uint8Array): Promise<Uint8Array>;
    decrypt(data: Uint8Array): Promise<Uint8Array>;
    private waitForScript;
}
