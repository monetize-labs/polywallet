import {
  HandCashCloudAccount,
  HandCashConnect,
} from '@handcash/handcash-connect';
import {
  AbstractPaymailSignatures,
  AuthenticationError,
  encodeBase64,
  Polywallet,
  SignaturePair,
  Utxo,
  UtxoP2PKH,
} from '@polywallet/core';
import { PrivateKey } from '@runonbitcoin/nimble';
// @ts-ignore
import decodeBase64 from '@runonbitcoin/nimble/functions/decode-base64';
// @ts-ignore
import decodeHex from '@runonbitcoin/nimble/functions/decode-hex';
import { encrypt, decrypt } from 'eciesjs';

export interface HandCashBuilderOptions {
  appId: string;
  appSecret: string;
}

export interface HandCashAuthenticationOptions {
  authToken: string;
  referrer?: string;
}

export class HandCashWallet
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
        base: ['#38cb7c', '#1cb462'],
        hover: ['#31c475', '#16b15d'],
      },
      label: 'HandCash',
      logo: 'data:image/webp;base64,UklGRmQEAABXRUJQVlA4WAoAAAAwAAAAFwAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOEwmAgAALxfABRBnxaBtG0Euf9C5u38QBJI2rn/nX0BQ5P9oCNq2bapu9xNI2hTY9sdA2iQAEOZQ4CONAA8ojs4vAgeOBGMURwIYYGEuQb8slD/FXckcFMUojgzCWJjPmwQFHg1zBPOeHAZuoEvnyDEKREdwAChE59IDiI0DV8Eo4E7iJgkz7yQoDgtjKB8VUMABBvjuCUAdKRpGvpFhLpVHDTsl94jvjd8HjsQpGQGnZA4FEiTJNm2rnm3btm37fdu2bfvfbz37oGd5LuLPIKL/atu2Yexk6u0KAAAAAAAAAACgcby7KCXIh29GXxoMScuP9lR41ZY3r2shdkvSums62FP7P2lrALj27MOGpb+7Qt213WWbi5NAZG7T3vfSvx1+jqa/kLQrwr23wIZFU9/rgYDZJc1t9zZj6SvLOB0FSXdlXA0AKrcd7AyF5FOG3hRC/g/97AF65yWd3f9UkjQAHdLzYihfdMtnyjZl6zBM2HoYBzudNiw3k2XrCkzJvB8DR+RmW/3y8sJtmdehT3qaDV2mG67VBHJCOgolq3I1Q8glx/q1AJLuSKOQ+lhb+4DQHfcenckBWl36VgZBB9asj3XOJqMTApwqNw3jRjxQ/llaqXJbs6O3pLl+txZmfkuvxvICnR4yb0ibZ8PdELT7jzT35OKhGKh+p63ziR49h+34ZTjrHYGsBwvnk73czr/t3FtJJyFscjDM87HcMhYNH7t83B+C//cpAQ==',
    };

  private account?: HandCashCloudAccount;
  private connect: HandCashConnect;
  private encryptionPrivateKeyHex?: string;
  private encryptionPublicKeyHex?: string;

  public constructor(options: HandCashBuilderOptions) {
    super();
    this.connect = new HandCashConnect({
      appId: options.appId,
      appSecret: options.appSecret,
    });

    const authToken = new URLSearchParams(window.location.search).get(
      'authToken',
    );
    if (authToken) {
      this.account = this.connect.getAccountFromAuthToken(authToken);
    }
  }

  public async authenticate(
    options?: HandCashAuthenticationOptions,
  ): Promise<void> {
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

  public async isAuthenticated(): Promise<boolean> {
    try {
      if (this.account) {
        await this.account.profile.getCurrentProfile();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public async getSpendableBalance(): Promise<number> {
    this.authenticationGuard('getSpendableBalance()');

    const { spendableSatoshiBalance } =
      await this.account!.wallet.getSpendableBalance('USD');
    return spendableSatoshiBalance;
  }

  public async sendToBitcoinAddress(
    destinationAddress: string,
    amountSatoshis: number,
  ): Promise<Utxo> {
    this.authenticationGuard('sendToBitcoinAddress(destinationAddress)');

    // TODO: Remove any type when PaymentResult interface is updated
    const { rawTransactionHex }: any = await this.account!.wallet.pay({
      payments: [
        {
          destination: destinationAddress,
          currencyCode: 'SAT',
          sendAmount: amountSatoshis,
        },
      ],
    });
    return UtxoP2PKH.fromTransactionHex(rawTransactionHex, destinationAddress);
  }

  public async getPaymail(): Promise<string> {
    this.authenticationGuard('getPaymail()');

    if (!this.paymail) {
      const {
        publicProfile: { paymail },
      } = await this.account!.profile.getCurrentProfile();
      this.paymail = paymail;
    }

    return this.paymail;
  }

  public async sign(data: Uint8Array): Promise<SignaturePair> {
    this.authenticationGuard('sign(data)');

    const dataBase64: string = encodeBase64(data);
    const { signature, publicKey } = await this.account!.profile.signData({
      value: dataBase64,
      format: 'utf-8',
    });
    return {
      data: new TextEncoder().encode(dataBase64),
      signature: decodeBase64(signature),
      publicKey: decodeHex(publicKey),
    };
  }

  public async encrypt(data: Uint8Array): Promise<Uint8Array> {
    this.authenticationGuard('encrypt(data)');

    if (!this.encryptionPublicKeyHex) {
      await this.fetchEncryptionKeyPair();
    }

    const dataBase64: string = encodeBase64(data);
    return encrypt(
      Buffer.from(decodeHex(this.encryptionPublicKeyHex!)),
      Buffer.from(dataBase64),
    );
  }

  public async decrypt(data: Uint8Array): Promise<Uint8Array> {
    this.authenticationGuard('decrypt(data)');

    if (!this.encryptionPrivateKeyHex) {
      await this.fetchEncryptionKeyPair();
    }

    const dataBase64: string = decrypt(
      Buffer.from(PrivateKey.fromString(this.encryptionPrivateKeyHex!).number),
      Buffer.from(data),
    ).toString();
    return decodeBase64(dataBase64);
  }

  private async fetchEncryptionKeyPair(): Promise<void> {
    const { privateKey, publicKey } =
      await this.account!.profile.getEncryptionKeypair();
    this.encryptionPrivateKeyHex = privateKey;
    this.encryptionPublicKeyHex = publicKey;
  }

  private authenticationGuard(method: string): void {
    if (!this.account) {
      throw new AuthenticationError(
        `Attempted to call ${method} on HandCash wallet while unauthenticated. Please call authenticate() first.`,
      );
    }
  }
}
