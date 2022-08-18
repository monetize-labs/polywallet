import { Polywallet, SignaturePair } from './types';
export declare abstract class AbstractSignatures implements Polywallet.Signatures {
    protected publicKey?: Uint8Array;
    abstract getPublicKey(): Promise<Uint8Array>;
    abstract sign(data: Uint8Array): Promise<SignaturePair>;
    verify(data: Uint8Array, signature: Uint8Array, publicKey?: Uint8Array): Promise<boolean>;
}
export declare abstract class AbstractPaymailSignatures extends AbstractSignatures implements Polywallet.Paymail {
    protected paymail?: string;
    protected paymailClient: any;
    private changeOutputScript?;
    abstract getPaymail(): Promise<string>;
    getPublicKey(): Promise<Uint8Array>;
    getChangeOutputScript(): Promise<Uint8Array>;
}
