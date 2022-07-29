import { ISignaturePair, Polywallet, Utxo } from '../types';
import loadScripts from 'load-scripts';
import { SATOSHIS_PER_BITCOIN } from '../config';
import { P2PKHAddress, PublicKey, Transaction } from 'bsv-wasm-web';
import { UtxoP2PKH } from '../utxo/utxo-p2pkh';
//@ts-ignore
import { PaymailClient } from '@moneybutton/paymail-client';
import { BSMVerify } from '../util';
import { waitUntil } from 'async-wait-until';

export interface RelayXBuilderOptions {
  /**
   * This is a bitcoin address prefix that you need to get from the RelayX team
   * see \@relayxio on Twitter for their support links.
   */
  bitcomPrefix: string;
}

export class RelayXWallet implements Polywallet.EncryptablePaymailWallet {
  paymailClient: any = new PaymailClient();
  relayone: any;
  paymail?: string;
  bitcomPrefix?: string;

  constructor(options: RelayXBuilderOptions) {
    loadScripts('https://one.relayx.io/relayone.js');
    this.bitcomPrefix = options.bitcomPrefix;
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.relayone) {
      await loadScripts('https://one.relayx.io/relayone.js');
      await waitUntil(() => !!(window as any).relayone);
      this.relayone = (window as any).relayone;
    }

    return this.relayone.isLinked();
  }

  async authenticate(): Promise<void> {
    if (!this.relayone) {
      await loadScripts('https://one.relayx.io/relayone.js');
      await waitUntil(() => !!(window as any).relayone);
      this.relayone = (window as any).relayone;
    }

    await this.relayone.authBeta();
  }

  async getPaymail(): Promise<string> {
    if (this.paymail) {
      return this.paymail;
    }
    const token = await this.relayone.authBeta();
    const [payload, signature] = token.split('.');
    const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));

    this.paymail = data.paymail;

    return this.paymail!;
  }

  async sign(data: Uint8Array): Promise<ISignaturePair> {
    const signableData =
      this.bitcomPrefix + Buffer.from(data).toString('utf-8');
    const signatureResult = await this.relayone.sign(signableData);
    const publicKey = await this.getPaymailPublicKey();

    return {
      data: Buffer.from(signableData),
      signature: Buffer.from(signatureResult.value, 'base64'),
      publicKey: publicKey.toBytes(),
    };
  }

  async verify(message: Uint8Array, signature: Uint8Array): Promise<boolean> {
    const paymailPublicKey = await this.getPaymailPublicKey();
    return BSMVerify(message, paymailPublicKey.toBytes(), signature);
  }

  async getSpendableBalance(): Promise<number> {
    return parseInt((await this.relayone.getBalance2()).satoshis);
  }

  async sendToBitcoinAddress(
    destinationAddress: string,
    amountSatoshis: number,
  ): Promise<Utxo> {
    let paymentResult = await this.relayone.send({
      to: destinationAddress,
      amount: amountSatoshis / SATOSHIS_PER_BITCOIN,
      currency: 'BSV',
    });

    let tx = Transaction.fromHex(paymentResult.rawTx);
    let lockScriptBuffer = Buffer.from(
      P2PKHAddress.fromString(destinationAddress).toLockingScript().toBytes(),
    );

    let i = 0;
    for (i = 0; i < tx.getOutputsCount(); i++) {
      if (
        Buffer.from(tx.getOutput(i)!.getScriptPubKey().toBytes()).equals(
          lockScriptBuffer,
        )
      ) {
        break;
      }
    }

    return new UtxoP2PKH(
      destinationAddress,
      amountSatoshis,
      Buffer.from(paymentResult.txid, 'hex'),
      i,
    );
  }

  async encrypt(plainText: Uint8Array): Promise<Uint8Array> {
    const encryptableString =
      this.bitcomPrefix + Buffer.from(plainText).toString('hex');
    const paymail = await this.getPaymail();

    const encryptResult = await this.relayone.encrypt(
      encryptableString,
      paymail,
    );
    return Buffer.from(encryptResult.value, 'hex');
  }

  async decrypt(cipherText: Uint8Array): Promise<Uint8Array> {
    const decryptableString = Buffer.from(cipherText).toString('hex');
    const decryptResult = await this.relayone.decrypt(decryptableString);

    let result = decryptResult.value.slice(this.bitcomPrefix!.length);
    return Buffer.from(result, 'hex');
  }

  async getChangeOutputScript(): Promise<Uint8Array> {
    const paymail = await this.getPaymail();
    const timestamp = JSON.stringify({ now: new Date() });

    // This implies any amount
    const amount = '0';

    // We should consider changing this to be app specific.
    const purpose = 'Getting my own damn Bitcoin address.';

    // Algorithm detailed here: https://bsvalias.org/04-01-basic-address-resolution.html
    const { publicKey, signature } = await this.sign(
      Buffer.from(paymail + timestamp + amount + purpose),
    );

    return await this.paymailClient
      .getOutputFor(paymail, {
        senderHandle: paymail,
        purpose,
        dt: timestamp,
        pubkey: Buffer.from(publicKey).toString('hex'),
        signature,
      })
      .then((output: string) => Buffer.from(output, 'hex'));
  }

  private async getPaymailPublicKey(): Promise<PublicKey> {
    const paymailPublicKeyHex = await this.paymailClient.getPublicKey(
      await this.getPaymail(),
    );
    return PublicKey.fromHex(paymailPublicKeyHex);
  }
}
