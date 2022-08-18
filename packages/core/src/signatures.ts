// @ts-ignore
import { PaymailClient } from '@moneybutton/paymail-client';
import { classes, PublicKey } from '@runonbitcoin/nimble';
// @ts-ignore
import decodeHex from '@runonbitcoin/nimble/functions/decode-hex';
// @ts-ignore
import ecdsaVerify from '@runonbitcoin/nimble/functions/ecdsa-verify';
// @ts-ignore
import encodeHex from '@runonbitcoin/nimble/functions/encode-hex';
// @ts-ignore
import sha256d from '@runonbitcoin/nimble/functions/sha256d';
// @ts-ignore
import writeVarint from '@runonbitcoin/nimble/functions/write-varint';
import { BSM_DATA_PREFIX } from './constants';
import { Polywallet, SignaturePair } from './types';
import { encodeBase64, removeLeadingZeros } from './utils';

export abstract class AbstractSignatures implements Polywallet.Signatures {
  protected publicKey?: Uint8Array;

  public abstract getPublicKey(): Promise<Uint8Array>;

  public abstract sign(data: Uint8Array): Promise<SignaturePair>;

  public async verify(
    data: Uint8Array,
    signature: Uint8Array,
    publicKey?: Uint8Array,
  ): Promise<boolean> {
    const rs = {
      r: removeLeadingZeros(signature.slice(1, 33)),
      s: removeLeadingZeros(signature.slice(33, 65)),
    };

    const writer = new classes.BufferWriter();
    writeVarint(writer, BSM_DATA_PREFIX.length);
    writer.write(BSM_DATA_PREFIX);
    writeVarint(writer, data.length);
    writer.write(data);
    const hash: Uint8Array = sha256d(writer.toBuffer());

    const publicKeyHex: string = encodeHex(
      publicKey ?? (await this.getPublicKey()),
    );
    const { point } = PublicKey.fromString(publicKeyHex);

    return ecdsaVerify(rs, hash, point);
  }
}

export abstract class AbstractPaymailSignatures
  extends AbstractSignatures
  implements Polywallet.Paymail
{
  protected paymail?: string;
  protected paymailClient = new PaymailClient();

  private changeOutputScript?: Uint8Array;

  public abstract getPaymail(): Promise<string>;

  public async getPublicKey(): Promise<Uint8Array> {
    if (!this.publicKey) {
      const paymail: string = await this.getPaymail();
      const publicKeyHex: string = await this.paymailClient.getPublicKey(
        paymail,
      );
      this.publicKey = decodeHex(publicKeyHex) as Uint8Array;
    }

    return this.publicKey;
  }

  public async getChangeOutputScript(): Promise<Uint8Array> {
    if (!this.changeOutputScript) {
      const paymail: string = await this.getPaymail();
      const timestamp: string = JSON.stringify({ now: new Date() });

      // This implies any amount
      const amount = '0';

      // We should consider changing this to be app specific.
      const purpose = 'Getting my own damn Bitcoin address.';

      // Algorithm detailed here: https://bsvalias.org/04-01-basic-address-resolution.html
      const { publicKey, signature } = await this.sign(
        new TextEncoder().encode(paymail + timestamp + amount + purpose),
      );

      const scriptHex: string = await this.paymailClient.getOutputFor(paymail, {
        senderHandle: paymail,
        purpose,
        dt: timestamp,
        pubkey: encodeHex(publicKey),
        signature: encodeBase64(signature),
      });

      this.changeOutputScript = decodeHex(scriptHex) as Uint8Array;
    }

    return this.changeOutputScript;
  }
}
