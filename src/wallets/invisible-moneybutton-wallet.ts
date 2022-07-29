import { ISignaturePair, Polywallet, Utxo } from '../types';
// @ts-ignore
import { loadMoneyButtonJs } from '@moneybutton/javascript-money-button';
//@ts-ignore
import { PaymailClient } from '@moneybutton/paymail-client';
import { SATOSHIS_PER_BITCOIN } from '../config';
import { PublicKey } from 'bsv-wasm-web';
import { BSMVerify } from '../util';

type IMB = any;

export interface InvisibleMoneyButtonBuilderOptions {
  clientIdentifier: string;

  /**
   * By setting this it MoneyButton will not authenticate the
   * user unless they agree to allow your app to spend up to this amount.
   *
   * This number is denoted in USD and will default to 0.01 USD
   */
  minimumAmount?: number;

  /**
   * By setting this it MoneyButton will suggest this amount to
   * be allowed to spend by the user by default.
   *
   * This number is denoted in USD and will default to 5 USD
   */
  suggestedAmount?: number;
}

export class InvisibleMoneyButtonWallet
  implements Polywallet.EncryptablePaymailWallet
{
  paymailClient: any = new PaymailClient();
  clientId: string;
  imb?: IMB;

  minimumAmount: number;
  suggestedAmount: number;
  myPaymail?: string;

  // TODO: consider moving loadMoneyButtonJs() to the constructor
  // and make isAuthenticated() rely on an interval to check if imb is set.
  constructor(options: InvisibleMoneyButtonBuilderOptions) {
    this.clientId = options.clientIdentifier;
    this.minimumAmount = options.minimumAmount || 0.01;
    this.suggestedAmount = options.suggestedAmount || 5;
  }

  async authenticate(): Promise<void> {
    if (!this.imb) {
      let moneyButton = await loadMoneyButtonJs();
      this.setIMBWithMoneyButton(moneyButton);
    }

    await this.imb.askForPermission();
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.imb) {
      let moneyButton = await loadMoneyButtonJs();
      this.setIMBWithMoneyButton(moneyButton);
    }

    try {
      await this.imb.amountLeft();
      return true;
    } catch (e) {
      return false;
    }
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

  async getPaymail(): Promise<string> {
    if (this.myPaymail) {
      return this.myPaymail;
    }

    this.myPaymail = await this.imb
      .swipe({
        cryptoOperations: [
          {
            name: 'myPaymail',
            method: 'paymail',
          },
        ],
      })
      .then(
        ({ cryptoOperations }: { cryptoOperations: any }) =>
          cryptoOperations[0].value,
      );

    return this.myPaymail as string;
  }

  sign(data: Uint8Array): Promise<ISignaturePair> {
    return this.imb
      .swipe({
        cryptoOperations: [
          {
            name: 'publicKey',
            method: 'public-key',
            key: 'identity',
          },
          {
            name: 'signature',
            method: 'sign',
            data: data.toString(),
            dataEncoding: 'utf8',
            key: 'identity',
            algorithm: 'bitcoin-signed-message',
          },
        ],
      })
      .then(({ cryptoOperations }: { cryptoOperations: any }) => {
        return {
          data,
          publicKey: Buffer.from(cryptoOperations[0].value, 'hex'),
          signature: Buffer.from(cryptoOperations[1].value, 'base64'),
        };
      });
  }

  async encrypt(plainText: Uint8Array): Promise<Uint8Array> {
    return this.imb
      .swipe({
        cryptoOperations: [
          {
            name: 'encryption',
            method: 'encrypt',
            data: Buffer.from(plainText).toString('hex'),
            dataEncoding: 'utf8',
            key: 'identity',
            algorithm: 'electrum-ecies',
          },
        ],
      })
      .then(({ cryptoOperations }: { cryptoOperations: any }) =>
        Buffer.from(cryptoOperations[0].value, 'hex'),
      );
  }

  async decrypt(cipherText: Uint8Array): Promise<Uint8Array> {
    return this.imb
      .swipe({
        cryptoOperations: [
          {
            name: 'decryption',
            method: 'decrypt',
            data: Buffer.from(cipherText).toString('hex'),
            dataEncoding: 'hex',
            valueEncoding: 'utf8',
            key: 'identity',
            algorithm: 'electrum-ecies',
          },
        ],
      })
      .then(({ cryptoOperations }: { cryptoOperations: any }) =>
        Buffer.from(cryptoOperations[0].value, 'hex'),
      );
  }

  async getSpendableBalance(): Promise<number> {
    return this.imb
      .amountLeft()
      .then((resp: any) => parseInt(resp.satoshis, 10));
  }

  async sendToBitcoinAddress(
    destinationAddress: string,
    amountSatoshis: number,
  ): Promise<Utxo> {
    const amountBSV = amountSatoshis / SATOSHIS_PER_BITCOIN;

    return this.imb
      .swipe({
        outputs: [
          {
            to: destinationAddress,
            amount: amountBSV.toString(10),
            currency: 'BSV',
          },
        ],
      })
      .then(({ payment }: { payment: any }) => {
        console.log(payment);
      });
  }

  async verify(message: Uint8Array, signature: Uint8Array): Promise<boolean> {
    const paymailPublicKey = await this.getPaymailPublicKey();
    return BSMVerify(message, paymailPublicKey.toBytes(), signature);
  }

  private setIMBWithMoneyButton(moneyButton: any) {
    this.imb = new moneyButton.IMB({
      clientIdentifier: this.clientId,
      minimumAmount: {
        amount: this.minimumAmount.toString(),
        currency: 'USD',
      },
      suggestedAmount: {
        amount: this.suggestedAmount.toString(),
        currency: 'USD',
      },
    });
  }

  private async getPaymailPublicKey(): Promise<PublicKey> {
    return this.imb
      .swipe({
        cryptoOperations: [
          {
            name: 'myPubKey',
            method: 'public-key',
            key: 'identity', // default value
          },
        ],
      })
      .then(({ cryptoOperations }: { cryptoOperations: any }) => {
        return PublicKey.fromHex(cryptoOperations[0].value);
      });
  }
}
