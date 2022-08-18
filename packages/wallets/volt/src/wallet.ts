import {
  AuthenticationError,
  Polywallet,
  Utxo,
  UtxoP2PKH,
} from '@polywallet/core';
import { Address } from '@runonbitcoin/nimble';
import { Bsv as Volt } from '@volt.id/sdk';
import { NetWork, PublicApi, TransferType } from '@volt.id/sdk/dist/types';

export class VoltWallet implements Polywallet.Wallet {
  public readonly authenticateButtonOptions: Polywallet.AuthenticateButtonOptions =
    {
      color: {
        base: ['#2bb696', '#21b593'],
        hover: ['#32af91', '#28af8e'],
      },
      label: 'Volt',
      logo: 'data:image/webp;base64,UklGRjYEAABXRUJQVlA4WAoAAAAwAAAAFwAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOEz3AQAALxfABRAH4ziSbSvpcx+PFWhyhmk8bs2D303DbWzbqnL2+R+XyB2Koh6GemgFiiAmc7/XUSTbrjJz///kVVSCFVTihz1IyPFxILeR5EiOBnO13rt7XxC1QiYyO9jSd3/w2ew54tc4Wk8n78XuNL/3Y/WWy+M+40U7+h/Oh229NT7vAwggO86Xw2xPb7qLxv130HF+mJWhR+1/tqa/oz46nJfHuSr9TxnXq+3Rf4A/0EitrXHH463ptpR1GM2Rcp368ztwOR/vpdJLtJOyLqF7h0x6iT3GDP4V9gQQkmsKrwSyiNg6IlhnMAlExhxh/W+rorsAElwL1BGE4KGhJJA6hBQRSKqhKJFBsm3bpu30Z9u2bdsxXpxzzvr/v0g7+95iyhH9V+C2jTLe4egVAAAAAAAAAAAAAAAAAAAAAAAAALUjuyfH6wN07p/Ot1XhmtWPEVm8m+o9z/LiqJKbdyLyiPi8cF9kETFUAXvfi8gj+714EUVExHBitWxFlFF8nb2JBK4aE9j6kZVh/Fy6TJ7LH8ZLq2k7jfl1+ba8UmRP/Ym9+S0J4+/cZXkmL57HEu75lQT9ZeWuvJ7lL33p66NF5EX8WTv7d7W882ai4q/W95HH6/RhlM/EdX+VEk8+xqeZhvaNtxEfDgartqSuuyVpQUdX/X9gPgAA',
    };

  private isConnected = false;
  private volt: PublicApi = Volt();

  public async authenticate(): Promise<void> {
    await this.volt.connectAccount({
      network: NetWork.Mainnet,
    });
    this.isConnected = await this.isAuthenticated();
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      await this.volt.getDepositAddress();
      return (this.isConnected = true);
    } catch {
      return (this.isConnected = false);
    }
  }

  public async getChangeOutputScript(): Promise<Uint8Array> {
    this.authenticationGuard('getChangeOutputScript()');

    const address = await this.volt.getDepositAddress();
    return Address.fromString(address).toScript().toBuffer();
  }

  public async getSpendableBalance(): Promise<number> {
    this.authenticationGuard('getSpendableBalance()');

    const { free } = await this.volt.getBsvBalance();
    return parseInt(free, 10);
  }

  public async sendToBitcoinAddress(
    destinationAddress: string,
    amountSatoshis: number,
  ): Promise<Utxo> {
    this.authenticationGuard('sendToBitcoinAddress()');

    const [{ txHex }] = await this.volt.batchTransfer({
      noBroadcast: false,
      list: [
        {
          type: TransferType.Bsv,
          data: {
            receivers: [
              {
                address: destinationAddress,
                amount: amountSatoshis.toString(10),
              },
            ],
            amountExact: true,
          },
        },
      ],
    });
    return UtxoP2PKH.fromTransactionHex(txHex, destinationAddress);
  }

  private authenticationGuard(method: string): void {
    if (!this.isConnected) {
      throw new AuthenticationError(
        `Attempted to call ${method} on Volt wallet while unauthenticated. Please call authenticate() first.`,
      );
    }
  }
}
