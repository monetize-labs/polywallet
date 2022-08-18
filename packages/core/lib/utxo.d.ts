import { Utxo } from './types';
export declare class UtxoP2PKH implements Utxo {
    amountSatoshis: number;
    previousTransactionId: Uint8Array;
    previousTransactionOutpoint: number;
    previousScriptPublicKey: Uint8Array;
    constructor(address: string, amountSatoshis: number, previousTransactionId: Uint8Array, previousTransactionOutpoint: number);
    static fromTransactionHex(transactionHex: string, address: string): UtxoP2PKH;
}
