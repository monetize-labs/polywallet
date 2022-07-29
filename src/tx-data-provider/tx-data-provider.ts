import { P2PKHAddress } from 'bsv-wasm-web';
import { backOff } from 'exponential-backoff';

export interface ITxOutputData {
  lockScriptHex: string;
  amountSats: number;
}

export class ITxData {
  constructor(public outputs: ITxOutputData[], public locktime: number) {}

  getOutputIndexByAddress(address: string): number {
    const addressLockScriptHex = P2PKHAddress.fromString(address)
      .toLockingScript()
      .toHex();
    return this.outputs.findIndex(
      (output) => output.lockScriptHex === addressLockScriptHex,
    );
  }
}

export abstract class TxDataProvider {
  public async getTxData(txid: string): Promise<ITxData> {
    return backOff(() => this.getTxDataImpl(txid), {
      jitter: 'full',
      numOfAttempts: 10,
      startingDelay: 500,
    });
  }

  protected abstract getTxDataImpl(txid: string): Promise<ITxData>;
}
