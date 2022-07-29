import { ECIES, ECIESCiphertext, PrivateKey, PublicKey } from 'bsv-wasm-web';
import { Buffer } from 'buffer';
//@ts-ignore
import { PaymailClient } from '@moneybutton/paymail-client';
import {
  HandCashCloudAccount,
  HandCashConnect,
} from '@handcash/handcash-connect';
import { AuthenticationError } from '../exceptions';
import { TxDataProvider, WhatsOnChainDataProvider } from '../tx-data-provider';
import { ISignaturePair, Polywallet, Utxo } from '../types';
import { UtxoP2PKH } from '../utxo/utxo-p2pkh';
import { BSMVerify } from '../util';

export interface HandCashBuilderOptions {
  appId: string;
  appSecret: string;
}

export interface HandCashAuthenticationOptions {
  authToken: string;
  referrer?: string;
}

export class HandCashWallet implements Polywallet.EncryptablePaymailWallet {
  paymailClient: any = new PaymailClient();
  account!: HandCashCloudAccount;
  connect: HandCashConnect;
  paymail?: string;
  encryptionPublicKey?: PublicKey;
  encryptionPrivateKey?: PrivateKey;

  private txDataProvider: TxDataProvider = new WhatsOnChainDataProvider();

  constructor(options: HandCashBuilderOptions) {
    this.connect = new HandCashConnect({
      appId: options.appId,
      appSecret: options.appSecret,
    });

    const authToken: string | null = new URLSearchParams(
      window.location.search,
    ).get('authToken');
    if (authToken) {
      this.account = this.connect.getAccountFromAuthToken(authToken);
    }
  }

  /**
   *  To grab the Bitcoin address, we have
   * */
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

  async isAuthenticated(): Promise<boolean> {
    if (!this.account) {
      return false;
    }

    try {
      await this.getPaymail();
      return true;
    } catch {
      return false;
    }
  }

  async authenticate(options?: HandCashAuthenticationOptions): Promise<void> {
    if (options?.authToken) {
      this.account = this.connect.getAccountFromAuthToken(options.authToken);
      return;
    }

    // For non-browsers we rely solely on options to provide
    // authentication information.
    if (typeof window === 'undefined') {
      throw new AuthenticationError(
        'For non-browsers you must provide a handcash authToken in authenticate(opts).',
      );
    }

    location.href = await this.connect.getRedirectionUrl({
      referrer: options?.referrer ?? 'monetize',
    });
  }

  async sign(data: Uint8Array): Promise<ISignaturePair> {
    this.authenticationGuard('sign(data)');
    if (!this.account) {
      throw new AuthenticationError(
        'Attempted to use handcash while Unauthenticated, please call authenticate() first.',
      );
    }

    const { signature, publicKey } = await this.account.profile.signData({
      value: Buffer.from(data).toString('hex'),
      format: 'hex',
    });

    return new Promise((resolve) => {
      return resolve({
        data,
        signature: Buffer.from(signature, 'base64'),
        publicKey: Buffer.from(publicKey, 'hex'),
      });
    });
  }

  async verify(message: Uint8Array, signature: Uint8Array): Promise<boolean> {
    const paymailPublicKey = await this.getPaymailPublicKey();
    return BSMVerify(message, paymailPublicKey.toBytes(), signature);
  }

  async encrypt(plainText: Uint8Array): Promise<Uint8Array> {
    this.authenticationGuard('encrypt(plainText)');

    if (!this.encryptionPublicKey) {
      await this.fetchEncryptionKeyPair();
    }

    return ECIES.encrypt(
      plainText,
      this.encryptionPrivateKey!,
      this.encryptionPublicKey!,
      true,
    ).toBytes();
  }

  async decrypt(cipherText: Uint8Array): Promise<Uint8Array> {
    this.authenticationGuard('decrypt(cipherText)');
    if (!this.encryptionPrivateKey) {
      await this.fetchEncryptionKeyPair();
    }

    return ECIES.decrypt(
      ECIESCiphertext.fromBytes(cipherText, false),
      this.encryptionPrivateKey!,
      this.encryptionPublicKey!,
    );
  }

  async sendToBitcoinAddress(
    destinationAddress: string,
    amountSatoshis: number,
  ): Promise<Utxo> {
    this.authenticationGuard('sentToBitcoinAddress(destinationAddress)');
    const paymentResult = await this.account.wallet.pay({
      payments: [
        {
          destination: destinationAddress,
          currencyCode: 'SAT',
          sendAmount: amountSatoshis,
          tags: [],
        },
      ],
    });

    // TODO: beg handcash to make this part of the paymentResult so no one has
    // to depend on WhatsOnChain
    const txOutpoint = (
      await this.txDataProvider.getTxData(paymentResult.transactionId)
    ).getOutputIndexByAddress(destinationAddress);

    return new UtxoP2PKH(
      destinationAddress,
      amountSatoshis,
      Buffer.from(paymentResult.transactionId, 'hex'),
      txOutpoint,
    );
  }

  async getSpendableBalance(): Promise<number> {
    this.authenticationGuard('getSpendableBalance()');

    return this.account.wallet
      .getSpendableBalance('USD')
      .then((response: any) => response.spendableSatoshiBalance);
  }

  async getPaymail(): Promise<string> {
    this.authenticationGuard('getPaymail()');
    if (!this.paymail) {
      const currentProfile = await this.account.profile.getCurrentProfile();
      const paymail: string = currentProfile.publicProfile.paymail;

      this.paymail = paymail;
    }

    return this.paymail;
  }

  private authenticationGuard(method: string) {
    if (!this.account) {
      throw new AuthenticationError(
        `Attempted to call ${method} on Handcash while unauthenticated. Please call authenticate() first`,
      );
    }
  }

  private async fetchEncryptionKeyPair() {
    const { privateKey, publicKey } =
      await this.account.profile.getEncryptionKeypair();
    this.encryptionPrivateKey = PrivateKey.fromWIF(privateKey);
    this.encryptionPublicKey = PublicKey.fromHex(publicKey);
  }

  private async getPaymailPublicKey(): Promise<PublicKey> {
    const paymailPublicKeyHex = await this.paymailClient.getPublicKey(
      await this.getPaymail(),
    );
    return PublicKey.fromHex(paymailPublicKeyHex);
  }
}
