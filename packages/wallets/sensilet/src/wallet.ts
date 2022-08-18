import {
  AbstractSignatures,
  AuthenticationError,
  encodeBase64,
  Polywallet,
  SignaturePair,
  Utxo,
  UtxoP2PKH,
} from '@polywallet/core';
import { Address } from '@runonbitcoin/nimble';
// @ts-ignore
import decodeBase64 from '@runonbitcoin/nimble/functions/decode-base64';
// @ts-ignore
import decodeHex from '@runonbitcoin/nimble/functions/decode-hex';

export class SensiletWallet
  extends AbstractSignatures
  implements Polywallet.Wallet, Polywallet.Balance, Polywallet.Signatures
{
  public authenticateButtonOptions: Polywallet.AuthenticateButtonOptions = {
    color: {
      base: ['#517195', '#496d95'],
      hover: ['#466281', '#405e81'],
    },
    label: 'Sensilet',
    logo: 'data:image/webp;base64,UklGRk4FAABXRUJQVlA4WAoAAAAwAAAAFwAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOEwPAwAALxfABRDnBMe2tWPPvb9t2/6TzlatOXAW7lN7DkaVlS59Sts2n2nAjmRbtdJz7nu4O39EQMCkRBAWgft9r6Bu23b8uZ/3ZzOZyb9fMsestnV7q6zq+iNsxsVfHNOabT2M2khyHHX37uXA4vBdAMiaIwExIFN3c0fg2g7B8fNldVuKAHGdWX39fvV363dBxHFoWq4erqrfVo3YrfcgQPD69roYN7QINLtyr2+vE8Hb93u856a8vbxPAt+N/f+Zf6reUKz/q79w4P1fcRDChaAktv+ZgwGKQX7nv0kARDERhhUIwd/8HwQEEoUAg0hADIiseSFQTAIQBfokIJCAQCAEQLbu57szvn2MdzKxykWcj81uZ7wq7FMLDDY/LSiJCQ+npVb1arbQok711tuUF6Sj1KTkthnO2k02S0dpSJefjv3nNd2cKklNyibGBDUpEupkachttE1Fqk5WiyrDjSLQUjDS0FPr02a4EQZqDmZdPXHqsDDtUhKSBaT8M0jY7FAsjxAXJYntjiQdshq21wUlKQJ/FTatFITHcc/B6qpxVg10YhgAIXZWH6dJWkoETAIBARDEANHaNsPN32ZqJqlt27Zt2+7Wtm3sl73Z7UynvYSI/itw20YZHo5fQURERETEbOwZEREREZEMvMIj/H+TdG1OKS/O8GR/s2sSLECi+59kStIAAAn6Ur72SAUE0NLlZA4uA1QLp5IQnX6vTcnl4inflaZ7GkR2SRJPvl70A24yXjcm3Capwvrp8XxUAJUbY97JwMfR2tzDzft70+fZ1uKJijR/ZhtVruFyc3l67GB7oPp+RRnvhqU40sEuuhLq/oyitL/tDB5eKcpQo4rKGEcWUARc9PbMt30D2JvvqG0BCgIZkU828Lo+0jdxfL1b1zB5BzXLj3FDbjk8/dsFRZlq5oXKNDKxcD6FlSqwqmy0LgFVBX6SDviEVgKzw101z6gI85U1xuBTCO20s74fWoGfFe+vZJkLodo/1mTzIBjL403JMlrLBkVirDJfv/3PvAXExQb9DOJ/Js7JWcYEAA==',
  };

  private isConnected = false;
  private sensilet?: any;

  public async authenticate(): Promise<void> {
    this.extensionGuard('authenticate()');

    await this.sensilet!.requestAccount();
    this.isConnected = await this.isAuthenticated();
  }

  public async isAuthenticated(): Promise<boolean> {
    this.isConnected = await this.sensilet?.isConnect();
    return this.isConnected;
  }

  public async getChangeOutputScript(): Promise<Uint8Array> {
    this.authenticationGuard('getChangeOutputScript()');

    const address = await this.sensilet!.getAddress();
    return Address.fromString(address).toScript().toBuffer();
  }

  public async sendToBitcoinAddress(
    destinationAddress: string,
    amountSatoshis: number,
  ): Promise<Utxo> {
    this.authenticationGuard('sendToBitcoinAddress()');

    const { txHex } = await this.sensilet!.transferBsv({
      receivers: [{ address: destinationAddress, amount: amountSatoshis }],
    });
    return UtxoP2PKH.fromTransactionHex(txHex, destinationAddress);
  }

  public async getSpendableBalance(): Promise<number> {
    this.authenticationGuard('getSpendableBalance()');

    const {
      balance: { total },
    } = await this.sensilet!.getBsvBalance();
    return total;
  }

  public async getPublicKey(): Promise<Uint8Array> {
    this.authenticationGuard('getPublicKey()');

    if (!this.publicKey) {
      const publicKeyHex: string = await this.sensilet!.getPublicKey();
      this.publicKey = decodeHex(publicKeyHex) as Uint8Array;
    }
    return this.publicKey;
  }

  public async sign(data: Uint8Array): Promise<SignaturePair> {
    this.authenticationGuard('sign()');

    const dataBase64: string = encodeBase64(data);
    const signatureBase64: string = await this.sensilet!.signMessage(
      dataBase64,
    );
    return {
      data: new TextEncoder().encode(dataBase64),
      publicKey: await this.getPublicKey(),
      signature: decodeBase64(signatureBase64),
    };
  }

  private authenticationGuard(method: string): void {
    if (!this.isConnected) {
      throw new AuthenticationError(
        `Attempted to call ${method} on Sensilet wallet while unauthenticated. Please call authenticate() first.`,
      );
    }
  }

  private extensionGuard(method: string): void {
    if (!this.sensilet) {
      const provider = (window as any).sensilet;
      if (typeof provider !== 'undefined') {
        this.sensilet = provider;
      } else {
        window.open('https://sensilet.com/', '_blank');
        throw new AuthenticationError(
          `Attempted to call ${method} on Sensilet wallet while extension is not installed. Please install Sensilet Wallet Extension first.`,
        );
      }
    }
  }
}
