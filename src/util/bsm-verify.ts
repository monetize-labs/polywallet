import { Address, Bsm, PubKey } from '@ts-bitcoin/core';

export function BSMVerify(
  message: Uint8Array,
  publicKey: Uint8Array,
  signature: Uint8Array,
): boolean {
  return Bsm.verify(
    Buffer.from(message),
    Buffer.from(signature).toString('base64'),
    Address.fromPubKey(PubKey.fromBuffer(Buffer.from(publicKey))),
  );
}
