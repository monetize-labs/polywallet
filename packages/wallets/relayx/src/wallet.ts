import {
  AbstractPaymailSignatures,
  Polywallet,
  SATOSHIS_PER_BITCOIN,
  SignaturePair,
  Utxo,
  UtxoP2PKH,
} from '@polywallet/core';
import waitUntil from 'async-wait-until';
import loadScripts from 'load-scripts';

export interface RelayXBuilderOptions {
  /**
   * This is a bitcoin address prefix that you need to get from the RelayX team
   * see \@relayxio on Twitter for their support links.
   */
  bitcomPrefix: string;
}

export class RelayXWallet
  extends AbstractPaymailSignatures
  implements
    Polywallet.Wallet,
    Polywallet.Balance,
    Polywallet.Signatures,
    Polywallet.Paymail,
    Polywallet.Encryption
{
  public readonly authenticateButtonOptions: Polywallet.AuthenticateButtonOptions =
    {
      color: {
        base: ['#2d39c3', '#2832c0'],
        hover: ['#1f2cc6', '#212bbe'],
      },
      label: 'RelayX',
      logo: 'data:image/webp;base64,UklGRk4EAABXRUJQVlA4WAoAAAAwAAAAFwAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOEwQAgAALxfABRB35KCNJEdyfeJP99I3DbdtI0kSNTjz8k/0s+6mILaN5Eiizv/nH6v/n4LYNpIjOUpNz3l/9x+wLZOGmBbBnMU4BYyXFhniCUK+mo/yThZGQ46+J3w9V4bm7KcfeLj6vZNvtwuLlv1twQ16+r+GEfKT8MDskOsjQ4Tp6UxAIRYX///Zr/g7D0fuep2rh7pnWITs9Apjwuw/kLYcuODEfuR/m0xsLjiJ/2xhetVBmMLClXCwRcyEJYJbGLl7irCGjiSz0hoN2U6FaSVsKxDCEmQ7kWSRIYAoSZJpq66fbdvW9bNt27Zt7/7zizh779MHRPRfkdu2jREfi3q9AgAAAAAAAAAAAAAAAAAAAAAAAAAAXXS21Z4bZ/ZKf+fi24d82mgO8cLEkQcxW1vYvno7l+yRYZOvUsj9hdKIhsv5UA9MmnrZ7nTXdO8d9yY03jVZFPoNP29nWECf0nc1ELG+Eat85LiRnVpt4YMnxW2PeVpELwjhUiSn7awUfNq1GrLfp0W1AmPXUZ20ajXYZO1ht1G5ajlzn6WVYP8sWN5NVeAWYiJYKyHnsbXsdDBco8HUIS8qFGkxm2sRPdeDKQawpG89DvkqsDTd1cf3ne1117g7t19GozzEHDR/0RBRsnAghHwcC/BYS/L83VJLUe20OO+P9FJjYPPG46e8Hy/3UWtXH8TmV1ZlfnX+/2YG',
    };

  private bitcomPrefix?: string;
  private relayone?: any;

  public constructor(options: RelayXBuilderOptions) {
    super();
    this.bitcomPrefix = options.bitcomPrefix;
    loadScripts('https://one.relayx.io/relayone.js');
  }

  public async authenticate(): Promise<void> {
    if (!this.relayone) {
      await loadScripts('https://one.relayx.io/relayone.js');
      await waitUntil(() => !!(window as any).relayone);
      this.relayone = (window as any).relayone;
    }

    await this.relayone.authBeta();
  }

  public async isAuthenticated(): Promise<boolean> {
    if (!this.relayone) {
      await loadScripts('https://one.relayx.io/relayone.js');
      await waitUntil(() => !!(window as any).relayone);
      this.relayone = (window as any).relayone;
    }

    return this.relayone.isLinked();
  }

  public async getSpendableBalance(): Promise<number> {
    const { satoshis } = await this.relayone.getBalance2();
    return parseInt(satoshis);
  }

  public async sendToBitcoinAddress(
    destinationAddress: string,
    amountSatoshis: number,
  ): Promise<Utxo> {
    const { rawTx } = await this.relayone.send({
      to: destinationAddress,
      amount: amountSatoshis / SATOSHIS_PER_BITCOIN,
      currency: 'BSV',
    });

    return UtxoP2PKH.fromTransactionHex(rawTx, destinationAddress);
  }

  public async getPaymail(): Promise<string> {
    if (this.paymail) {
      return this.paymail;
    }
    const token = await this.relayone.authBeta();
    const [payload] = token.split('.');
    const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));

    this.paymail = data.paymail;

    return this.paymail!;
  }

  public async sign(data: Uint8Array): Promise<SignaturePair> {
    const dataBase64: string = Buffer.from(data).toString('base64');
    const { value: signatureBase64 } = await this.relayone.sign(
      this.bitcomPrefix + dataBase64,
    );
    return {
      data: Buffer.from(dataBase64),
      signature: Buffer.from(signatureBase64, 'base64'),
      publicKey: await this.getPublicKey(),
    };
  }

  public async encrypt(data: Uint8Array): Promise<Uint8Array> {
    const dataHex: string = Buffer.from(data).toString('hex');
    const paymail: string = await this.getPaymail();
    const { value } = await this.relayone.encrypt(
      this.bitcomPrefix + dataHex,
      paymail,
    );
    return Buffer.from(value, 'hex');
  }

  public async decrypt(data: Uint8Array): Promise<Uint8Array> {
    const dataHex: string = Buffer.from(data).toString('hex');
    const { value } = await this.relayone.decrypt(dataHex);
    const decryptedDataHex: string = value.slice(this.bitcomPrefix!.length);
    return Buffer.from(decryptedDataHex, 'hex');
  }
}
