export interface EncryptionResult {
  cipherText: Uint8Array;
}

export interface SignaturePair {
  /** Binary data of the base64-encoded data */
  data: Uint8Array;
  publicKey: Uint8Array;
  signature: Uint8Array;
}

export interface Utxo {
  /** This should be stored in little-endian */
  readonly previousTransactionId: Uint8Array;
  readonly previousTransactionOutpoint: number;
  readonly previousScriptPublicKey: Uint8Array;
  readonly amountSatoshis: number;
}

export namespace Polywallet {
  export interface Balance {
    /** Returns either the amount left to spend or the wallet balance in satoshis. */
    getSpendableBalance(): Promise<number>;
  }

  export interface Signatures {
    /** Returns the public key or paymail public key if the wallet implements Paymail. */
    getPublicKey(): Promise<Uint8Array>;
    /**
     * This *MUST* sign with the public key for the wallet.
     * For paymail public key, see: https://bsvalias.org/03-public-key-infrastructure.html
     */
    sign(data: Uint8Array): Promise<SignaturePair>;
    /**
     * Validates data against the provided signature and the public key.
     * For paymail public key, see: https://bsvalias.org/03-public-key-infrastructure.html
     */
    verify(
      data: Uint8Array,
      signature: Uint8Array,
      publicKey?: Uint8Array,
    ): Promise<boolean>;
  }

  export interface Paymail {
    getPaymail(): Promise<string>;
  }

  /**
   * Although it would be useful, I don't think it's necessary for this to use pki
   * associated with the paymail.
   */
  export interface Encryption {
    encrypt(data: Uint8Array): Promise<Uint8Array>;
    decrypt(data: Uint8Array): Promise<Uint8Array>;
  }

  export interface Wallet {
    /** Attribute for defining styles for the authenticate button. */
    readonly authenticateButtonOptions: AuthenticateButtonOptions;
    /**
     * The method implementation should force the user to authenticate
     * themselves (most likely a redirect or popup of some kind).
     *
     * This does *NOT* guarantee that the user is authenticated.
     */
    authenticate(): Promise<void>;
    /**
     * Returns a boolean that indicates whether the wallet has been
     * authenticated.
     */
    isAuthenticated(): Promise<boolean>;
    /**
     * Returns a Script as a byte array that can be used to receive into this
     * wallet. Typically comes in P2PKH form, but this is not guaranteed! This
     * may use the paymail protocol so it can be slow. If you need to re-use
     * addresses, it is recommended that you cache this output.
     */
    getChangeOutputScript(): Promise<Uint8Array>;
    /**
     * Makes a payment of the given amount to the given address.
     *
     * @param destinationAddress The P2PKH Address of the receiver.
     * @param amountSatoshis The amount to send in satoshis.
     * @returns A UTXO.
     */
    sendToBitcoinAddress(
      destinationAddress: string,
      amountSatoshis: number,
    ): Promise<Utxo>;
  }

  export type SignableWallet = Wallet & Balance & Signatures;

  export type PaymailWallet = Wallet & Balance & Signatures & Paymail;

  export type PaymailWalletWithoutBalance = Wallet & Signatures & Paymail;

  export type EncryptablePaymailWallet = Wallet &
    Balance &
    Signatures &
    Paymail &
    Encryption;

  export interface AuthenticateButtonOptions {
    /** Linear gradient color stops for wallet button background color */
    color: {
      base: [Color, Color];
      hover: [Color, Color];
    };
    /** Text label for the wallet button */
    label: string;
    /** URL for the wallet logo */
    logo: string;
  }

  export interface AuthenticationModal {
    open<W extends Wallet>(wallets: W[]): void;
    close(): void;
  }
}

export type Color =
  | `#${string}`
  | `rgb(${number}, ${number}, ${number})`
  | `rgba(${number}, ${number}, ${number}, ${number})`;

/** Obtain the constructor type with return type */
export type Constructor<
  C extends abstract new (...args: ConstructorParameters<C>) => T,
  T,
> = new (...args: ConstructorParameters<C>) => T;
