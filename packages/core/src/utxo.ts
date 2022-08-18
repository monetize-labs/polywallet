import { Address, Transaction } from '@runonbitcoin/nimble';
// @ts-ignore
import decodeHex from '@runonbitcoin/nimble/functions/decode-hex';
import { Utxo } from './types';

export class UtxoP2PKH implements Utxo {
  public previousScriptPublicKey: Uint8Array;

  public constructor(
    address: string,
    public amountSatoshis: number,
    public previousTransactionId: Uint8Array,
    public previousTransactionOutpoint: number,
  ) {
    this.previousScriptPublicKey =
      Address.fromString(address).toScript().buffer;
  }

  public static fromTransactionHex(
    transactionHex: string,
    address: string,
  ): UtxoP2PKH {
    const { hash, outputs } = Transaction.fromHex(transactionHex);
    const lockingScriptHex: string = Address.fromString(address)
      .toScript()
      .toHex();
    const outpoint: number = outputs.findIndex(
      ({ script }) => script.toHex() === lockingScriptHex,
    );

    if (outpoint === -1) {
      throw new Error('Unexpected error, transaction did not contain address!');
    }

    return new UtxoP2PKH(
      address,
      outputs[outpoint].satoshis,
      decodeHex(hash),
      outpoint,
    );
  }
}
