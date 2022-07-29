import { Address, KeyPair } from '@ts-bitcoin/core';
import { ITxData, TxDataProvider } from './tx-data-provider';

export class InMemoryDataProvider extends TxDataProvider {
  constructor(private keyPair: KeyPair = KeyPair.fromRandom()) {
    super();
  }
  protected override async getTxDataImpl(_: string): Promise<ITxData> {
    return new ITxData(
      [
        {
          lockScriptHex: Address.fromPubKey(this.keyPair.pubKey)
            .toTxOutScript()
            .toHex(),
          amountSats: 1000,
        },
      ],
      0,
    );
  }
}
