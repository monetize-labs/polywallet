import {
  AbstractPaymailSignatures,
  AuthenticationError,
  encodeBase64,
  Polywallet,
  SignaturePair,
  Utxo,
  UtxoP2PKH,
} from '@polywallet/core';
// @ts-ignore
import decodeBase64 from '@runonbitcoin/nimble/functions/decode-base64';
// @ts-ignore
import decodeHex from '@runonbitcoin/nimble/functions/decode-hex';

export class TwetchWallet
  extends AbstractPaymailSignatures
  implements Polywallet.Wallet, Polywallet.Signatures, Polywallet.Paymail
{
  public readonly authenticateButtonOptions: Polywallet.AuthenticateButtonOptions =
    {
      color: {
        base: ['#323340', '#2e2f3e'],
        hover: ['#2c2d38', '#2b2c3a'],
      },
      label: 'Twetch',
      logo: 'data:image/webp;base64,UklGRq4FAABXRUJQVlA4WAoAAAAwAAAAFwAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOExvAwAALxfABRCvBre29rbNH5kzJ5A6lRpFQwbbvUdx7TZnmwH4CawBt7Zt1co5+8pzb4BB5NIKRXpMKRRA6vrsOtzatlUr+8jVLyE5pFRDkd4TxK7P37kCuW0jQXKScvXu3u8CCIDQ3ePT9odXu3966XB67XjlAiLnm9tO1zf3+DJsd3DxP07Zy9v/dX1UVHkPz8+Lqd3u6BLNeybkvb5/jASvbc+vKLKn19eAnDLzW7ahpj3Dyk9JmV/Li+T7d3p1Hf0tdSLBO/uo1Nr+uNXUidSiL38gmPnygOqABEP8ztPKKkFgDB0yzjsbsr5UOxbKqVJfn7+RYkWZB4Sc34+iZLHFAocsJ5oJtOBLgRszLQbLyuDnf74s923BUp0g0QgwrXN1ffQ7j4nUGJwofc5aqn3O2BFAVdjmbKolZy2WigiR5Lyrx4DJWFUZ511PJIUMkLAQ+4cEz7my4C1kFiNCgZy1Eq2yLPLWFgghI2Qw3xMhiImlPkg1YAQJmbUAoqpSbt8XAJlysRSL2TPfCrFn3l7dZBbaRDAA+/sbU6i8jsyVgMm0LdVl9vU3pMor6gwJEfUQBElM81RaRqu18lx9fg0Bt1RGeRn8zcuQgQVDhi20WAgGEeXM+1qIpTxPtlgT4axmKy8iIhYB07IuprJERyrEYvayIoiptexbkVCWhRgMmUPA37xUN4n5HlDvf53q+7Ovn7GuO/n++x+R8GE/YgWAqsp+/8eLqR+BxISQCRANEmTbNm1nftu2bdu2bdu2bQU/tm07P3aa9BA0IKL/atu2YeT01bkCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ776xXCUxUq7xSFJb3SVtUZNmZsflUJdeq9HjZfZSwtLsYe1K1v2jW18Lnge/ThPGQr/WMXfflz+q9d7rprwzEkz1zexTd9em4zvLNz7MNZUWCWJ80Lz1150QpwGL4d8XnBPrBZHfd71qMePQydVneS+Cbp0PEHI+sWSy65b88fug5Z5O5WdbwdRYjnv0+NpEeEv+1S8XGwpLBDE4YDf07UasZ7fD5M9zPqk1gkiffpqzHrV978qbhFceNx/4CTlHTpnuekU/+dRsvWdYPC4pBFn//WcOd4W1p2+8na1QFW6Mos18jGuP40iEioRII/Vnzu7cDhTLeEllNYX/8J0AAA==',
    };

  private twetch?: any;

  public async authenticate(): Promise<void> {
    this.extensionGuard('authenticate()');

    const { paymail, publicKey } = await this.twetch.connect();
    this.paymail = paymail;
    this.publicKey = decodeHex(publicKey);
  }

  public async isAuthenticated(): Promise<boolean> {
    return this.twetch?.isConnected ?? false;
  }

  public async sendToBitcoinAddress(
    destinationAddress: string,
    amountSatoshis: number,
  ): Promise<Utxo> {
    this.authenticationGuard('sendToBitcoinAddress()');

    const { rawtx } = await this.twetch.abi({
      contract: 'payment',
      outputs: [{ to: destinationAddress, sats: amountSatoshis }],
    });
    return UtxoP2PKH.fromTransactionHex(rawtx, destinationAddress);
  }

  public async getPaymail(): Promise<string> {
    this.authenticationGuard('getPaymail()');

    if (!this.paymail) {
      this.paymail = this.twetch!.paymail as string;
    }
    return this.paymail;
  }

  public async sign(data: Uint8Array): Promise<SignaturePair> {
    this.authenticationGuard('sign()');

    const dataBase64: string = encodeBase64(data);
    const { sig } = await this.twetch!.abi({
      contract: 'sign-message',
      method: 'sign-message',
      payload: { message: dataBase64 },
    });
    return {
      data: new TextEncoder().encode(dataBase64),
      publicKey: await this.getPublicKey(),
      signature: decodeBase64(sig, 'base64'),
    };
  }

  private authenticationGuard(method: string): void {
    this.extensionGuard(method);
    if (!this.twetch?.isConnected) {
      throw new AuthenticationError(
        `Attempted to call ${method} on Twetch wallet while unauthenticated. Please call authenticate() first.`,
      );
    }
  }

  private extensionGuard(method: string): void {
    if (!this.twetch) {
      const provider = (window as any).bitcoin;
      if (provider?.isTwetch) {
        this.twetch = provider;
      } else {
        window.open('https://twetch.com/downloads', '_blank');
        throw new AuthenticationError(
          `Attempted to call ${method} on Twetch wallet while extension is not installed. Please install Twetch Wallet Extension first.`,
        );
      }
    }
  }
}
