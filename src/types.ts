import { Script, TxIn } from 'bsv-wasm-web';

export interface ISignaturePair {
  data: Uint8Array;
  publicKey: Uint8Array;
  signature: Uint8Array;
}

export interface EncryptionResult {
  cipherText: Uint8Array;
}

export interface Utxo {
  // This should be stored in little-endian
  readonly prevTxId: Uint8Array;
  readonly prevTxOutPoint: number;
  readonly prevScriptPubKey: Uint8Array;
  readonly amountSatoshis: number;

  // Turns this UTXO into a TxIn
  toTxIn(sequenceNumber: number, scriptSig?: Script): TxIn;
}

export namespace Polywallet {
  /**
   * Although it would be useful, I don't think it's necessary for this to use pki
   * associated with the paymail.
   */
  export interface Encryptable {
    encrypt(plainText: Uint8Array): Promise<Uint8Array>;
    decrypt(cipherText: Uint8Array): Promise<Uint8Array>;
  }

  export interface BasicWallet {
    isAuthenticated(): Promise<boolean>;

    /**
     * The method implementation should force the user to authenticate
     * themselves (most likely a redirect or popup of some kind).
     *
     * This does *NOT* guarantee that the user is authenticated
     */
    authenticate(): Promise<void>;

    getSpendableBalance(): Promise<number>;

    sendToBitcoinAddress(
      destinationAddress: string,
      amountSatoshis: number,
    ): Promise<Utxo>;

    // Returns a Script as a byte array that can be used to receive into this wallet.
    // Typically comes in P2PKH form, but this is not guaranteed!
    // This may use the paymail protocol so it can be slow. If you need to re-use addresses
    // it is recommended that you cache this output.
    getChangeOutputScript(): Promise<Uint8Array>;
  }

  export interface PaymailWallet extends BasicWallet {
    getPaymail(): Promise<string>;

    /**
     * This *MUST* sign with the public key for the associated paymail
     * see: https://bsvalias.org/03-public-key-infrastructure.html
     */
    sign(data: Uint8Array): Promise<ISignaturePair>;

    /**
     * Validates this message against the provided signature
     * and the public key attached to the paymail for this wallet.
     * see: https://bsvalias.org/03-public-key-infrastructure.html
     */
    verify(message: Uint8Array, signature: Uint8Array): Promise<boolean>;
  }

  export type EncryptablePaymailWallet = PaymailWallet & Encryptable;
}
