import axios from 'axios';
import { ITxData, ITxOutputData, TxDataProvider } from './tx-data-provider';

const WOC_TX_URL_FACTORY = (txid: string) =>
  `https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`;

export class WhatsOnChainDataProvider extends TxDataProvider {
  protected override async getTxDataImpl(txid: string): Promise<ITxData> {
    const { data } = await axios.get(WOC_TX_URL_FACTORY(txid));
    return this.mapWhatsOnChainResponseToTxData(data);
  }

  private mapWhatsOnChainResponseToTxData(whatsOnChainResponse: any): ITxData {
    const outputs = whatsOnChainResponse.vout.map(
      (vout: any): ITxOutputData => {
        return {
          lockScriptHex: vout.scriptPubKey.hex,
          amountSats: Math.round(vout.value * 100000000),
        };
      },
    );

    return new ITxData(outputs, whatsOnChainResponse.locktime);
  }
}
