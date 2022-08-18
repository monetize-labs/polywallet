import {
  AbstractPaymailSignatures,
  encodeBase64,
  Polywallet,
  SATOSHIS_PER_BITCOIN,
  SignaturePair,
  Utxo,
  UtxoP2PKH,
} from '@polywallet/core';
// @ts-ignore
import { loadMoneyButtonJs } from '@moneybutton/javascript-money-button';
// @ts-ignore
import decodeBase64 from '@runonbitcoin/nimble/functions/decode-base64';
// @ts-ignore
import decodeHex from '@runonbitcoin/nimble/functions/decode-hex';
// @ts-ignore
import encodeHex from '@runonbitcoin/nimble/functions/encode-hex';
import { waitUntil } from 'async-wait-until';

export interface MoneyButtonBuilderOptions {
  /** Used to keep track of who paid for what. */
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

export class MoneyButtonWallet
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
        base: ['#4772f5', '#416ef7'],
        hover: ['#426ff5', '#3767f8'],
      },
      label: 'Money Button',
      logo: 'data:image/webp;base64,UklGRpoEAABXRUJQVlA4WAoAAAAwAAAAFwAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOExcAgAALxfABRBXBLW2bdXVPGFGyazZsk8XqSJlf3SnDbi1batW5v7uAkTukJKRaQFUQRe0rdl2Gtu2q6z7/yfn4HLGonAoPFXQBWVndxm3beQ4J2ku3y8FgAGJBCFJJJBERUBGRCpQBSZBLAEwQ3UESxI2iDBYoFDdUKCEWAIyJmqwJOKAhORKDLlgwY4ghIiIFCNQQUQsZARIUiWh5KgwEBKQCtQtVA9+hJDY1WAEKkRQmzX8//+vEArUImwve3x9vxaBSqCCAuX24UR/N+T1cefz9TSgNK6YnC0pjypiUFCftTg/Xdg9nrk8Xxkdz+jvRxKEJIP6rMXwaMr780F5XGN5veX5fqO+aFEaVZTGNYopkIQAsmXbNm2nX9u2z7VtW7EuYycnxlh7x9p/nTvXyVM+IKL/itw2UnIYWBx6BQAAAAAAAAAAAAAAAAAAAAAAAJCe5H+QmvBBWqrdqxjfm29Ih6L+zfWuXMhqWd0aKqPqmlNwqze5YF/Si8WslMn7ki4UnQskuSslffcChTpurjwJJWn2uhRKD2rXQgssPtYa9wK4fGq4R3XbFl6gmZiTiYObHo/rtuUFPN1uYUgHp4EFZsInJi/gw1PvWROBjz3zT7EjC9ud4SVyYOLsiL/s8/rZp7/YtcCc0BMzsZfPf/758PnwVHYk8SE3HXv1MYp+fz24KqdAd2uWZQk+GW568yOKovcXdg13qbj7tnGjseLo26/o+9OR8otOOu4gZyMuPZxISRm88+7L2/N5lA6sjFYnQX7nwlxbNmTUTy31FFrnMxPmICUl4YP0/2nYAA==',
    };

  private clientIdentifier: string;
  private invisibleMoneyButton?: any;
  private minimumAmount: number;
  private suggestedAmount: number;

  public constructor(options: MoneyButtonBuilderOptions) {
    super();
    this.loadScript();

    this.clientIdentifier = options.clientIdentifier;
    this.minimumAmount = options.minimumAmount ?? 0.01;
    this.suggestedAmount = options.suggestedAmount ?? 5;
  }

  /**
   * If someone constructs this object that means they've given the green light
   * to load Money Button scripts into the page. Hence, we do this so we can do
   * our authentication faster, if need-be.
   */
  private async loadScript(): Promise<void> {
    const { IMB } = await loadMoneyButtonJs();
    this.invisibleMoneyButton = new IMB({
      clientIdentifier: this.clientIdentifier,
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

  public async authenticate(): Promise<void> {
    await this.waitForScript();

    await this.invisibleMoneyButton.askForPermission();
  }

  public async isAuthenticated(): Promise<boolean> {
    await this.waitForScript();

    try {
      await this.invisibleMoneyButton.amountLeft();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Returns how much money the app has left to spend before user needs to authorize more.
   * This is not the wallet balance.
   *
   * @returns The spendable amount in satoshis.
   */
  public async getSpendableBalance(): Promise<number> {
    await this.waitForScript();

    const { satoshis } = await this.invisibleMoneyButton.amountLeft();
    return parseInt(satoshis, 10);
  }

  public async sendToBitcoinAddress(
    destinationAddress: string,
    amountSatoshis: number,
  ): Promise<Utxo> {
    await this.waitForScript();

    const amountBsv: number = amountSatoshis / SATOSHIS_PER_BITCOIN;
    const {
      payment: { rawtx },
    } = await this.invisibleMoneyButton.swipe({
      outputs: [
        {
          to: destinationAddress,
          amount: amountBsv.toString(10),
          currency: 'BSV',
        },
      ],
    });
    return UtxoP2PKH.fromTransactionHex(rawtx, destinationAddress);
  }

  public async getPaymail(): Promise<string> {
    await this.waitForScript();

    if (!this.paymail) {
      const {
        cryptoOperations: [{ value }],
      } = await this.invisibleMoneyButton.swipe({
        cryptoOperations: [{ name: 'myPaymail', method: 'paymail' }],
      });
      this.paymail = value as string;
    }
    return this.paymail;
  }

  public async sign(data: Uint8Array): Promise<SignaturePair> {
    await this.waitForScript();

    const dataBase64: string = encodeBase64(data);
    const {
      cryptoOperations: [{ value: publicKeyHex }, { value: signatureBase64 }],
    } = await this.invisibleMoneyButton.swipe({
      cryptoOperations: [
        {
          name: 'publicKey',
          method: 'public-key',
          key: 'identity',
        },
        {
          name: 'signature',
          method: 'sign',
          data: dataBase64,
          dataEncoding: 'utf8',
          key: 'identity',
          algorithm: 'bitcoin-signed-message',
        },
      ],
    });
    return {
      data: new TextEncoder().encode(dataBase64),
      publicKey: decodeHex(publicKeyHex),
      signature: decodeBase64(signatureBase64),
    };
  }

  public async encrypt(data: Uint8Array): Promise<Uint8Array> {
    await this.waitForScript();

    const {
      cryptoOperations: [{ value }],
    } = await this.invisibleMoneyButton.swipe({
      cryptoOperations: [
        {
          name: 'encryption',
          method: 'encrypt',
          data: encodeHex(data),
          dataEncoding: 'utf8',
          key: 'identity',
          algorithm: 'electrum-ecies',
        },
      ],
    });
    return decodeHex(value);
  }

  public async decrypt(data: Uint8Array): Promise<Uint8Array> {
    await this.waitForScript();

    const {
      cryptoOperations: [{ value }],
    } = await this.invisibleMoneyButton.swipe({
      cryptoOperations: [
        {
          name: 'decryption',
          method: 'decrypt',
          data: encodeHex(data),
          dataEncoding: 'hex',
          valueEncoding: 'utf8',
          key: 'identity',
          algorithm: 'electrum-ecies',
        },
      ],
    });
    return decodeHex(value);
  }

  private async waitForScript(): Promise<void> {
    await waitUntil(() => !!this.invisibleMoneyButton);
  }
}
