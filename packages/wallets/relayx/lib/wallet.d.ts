import { AbstractPaymailSignatures, Polywallet, SignaturePair, Utxo } from '@polywallet/core';
export interface RelayXBuilderOptions {
    bitcomPrefix: string;
}
export declare class RelayXWallet extends AbstractPaymailSignatures implements Polywallet.Wallet, Polywallet.Balance, Polywallet.Signatures, Polywallet.Paymail, Polywallet.Encryption {
    readonly authenticateButtonOptions: Polywallet.AuthenticateButtonOptions;
    private bitcomPrefix?;
    private relayone?;
    constructor(options: RelayXBuilderOptions);
    authenticate(): Promise<void>;
    isAuthenticated(): Promise<boolean>;
    getSpendableBalance(): Promise<number>;
    sendToBitcoinAddress(destinationAddress: string, amountSatoshis: number): Promise<Utxo>;
    getPaymail(): Promise<string>;
    sign(data: Uint8Array): Promise<SignaturePair>;
    encrypt(data: Uint8Array): Promise<Uint8Array>;
    decrypt(data: Uint8Array): Promise<Uint8Array>;
}
