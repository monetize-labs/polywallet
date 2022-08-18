export interface EncryptionResult {
    cipherText: Uint8Array;
}
export interface SignaturePair {
    data: Uint8Array;
    publicKey: Uint8Array;
    signature: Uint8Array;
}
export interface Utxo {
    readonly previousTransactionId: Uint8Array;
    readonly previousTransactionOutpoint: number;
    readonly previousScriptPublicKey: Uint8Array;
    readonly amountSatoshis: number;
}
export declare namespace Polywallet {
    interface Balance {
        getSpendableBalance(): Promise<number>;
    }
    interface Signatures {
        getPublicKey(): Promise<Uint8Array>;
        sign(data: Uint8Array): Promise<SignaturePair>;
        verify(data: Uint8Array, signature: Uint8Array, publicKey?: Uint8Array): Promise<boolean>;
    }
    interface Paymail {
        getPaymail(): Promise<string>;
    }
    interface Encryption {
        encrypt(data: Uint8Array): Promise<Uint8Array>;
        decrypt(data: Uint8Array): Promise<Uint8Array>;
    }
    interface Wallet {
        readonly authenticateButtonOptions: AuthenticateButtonOptions;
        authenticate(): Promise<void>;
        isAuthenticated(): Promise<boolean>;
        getChangeOutputScript(): Promise<Uint8Array>;
        sendToBitcoinAddress(destinationAddress: string, amountSatoshis: number): Promise<Utxo>;
    }
    type SignableWallet = Wallet & Balance & Signatures;
    type PaymailWallet = Wallet & Balance & Signatures & Paymail;
    type PaymailWalletWithoutBalance = Wallet & Signatures & Paymail;
    type EncryptablePaymailWallet = Wallet & Balance & Signatures & Paymail & Encryption;
    interface AuthenticateButtonOptions {
        color: {
            base: [Color, Color];
            hover: [Color, Color];
        };
        label: string;
        logo: string;
    }
    interface AuthenticationModal {
        open<W extends Wallet>(wallets: W[]): void;
        close(): void;
    }
}
export declare type Color = `#${string}` | `rgb(${number}, ${number}, ${number})` | `rgba(${number}, ${number}, ${number}, ${number})`;
export declare type Constructor<C extends abstract new (...args: ConstructorParameters<C>) => T, T> = new (...args: ConstructorParameters<C>) => T;
