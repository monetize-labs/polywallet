import { P2PKHAddress, Script, TxIn } from 'bsv-wasm-web';
import { Utxo } from '../types';

export class UtxoP2PKH implements Utxo {
  public prevScriptPubKey: Uint8Array;

  constructor(
    address: string,
    public amountSatoshis: number,
    public prevTxId: Uint8Array,
    public prevTxOutPoint: number,
  ) {
    this.prevScriptPubKey = P2PKHAddress.fromString(address)
      .toLockingScript()
      .toBytes();
  }

  toTxIn(sequenceNumber: number, scriptSig?: Script): TxIn {
    return new TxIn(
      this.prevTxId,
      this.prevTxOutPoint,
      scriptSig ?? new Script(),
      sequenceNumber,
    );
  }
}
