![](https://raw.githubusercontent.com/monetize-labs/polywallet/main/images/logo.png)

No wallets are built the same—**Polywallet** resolves the ambiguities faced by developers  using Bitcoin SV wallets.

**Polywallet** is an abstraction that enables you to keep your applications wallet agnostic and allow your customers the choice to select whichever wallet desired. Adapters for [HandCash](https://docs.handcash.io/docs), [RelayX](https://relayx.com/) and [Invisible Money Button](https://docs.moneybutton.com/docs/mb-invisible-money-button.html) are currently implemented for `EncryptablePaymailWallet`, the interface that your applications can depend on.

![Polywallet](https://raw.githubusercontent.com/monetize-labs/polywallet/main/images/modal.png)

## Install

Get started with **Polywallet** by running:

```shell
npm install polywallet
```


## Example Usage

```js
import { EncryptablePaymailWallet } from 'polywallet';

const polywallet = await new EncryptablePaymailWalletBuilder()
  .withHandCash({
    appId: 'APP_ID',
    appSecret: 'APP_SECRET',
  })
  .withInvisibleMoneyButton({
    clientIdentifier: 'CLIENT_ID',
  })
  .withRelayX({
    bitcomPrefix: 'BITCOM_PREFIX',
  })
  .build();
```



## Support

Reach out to us at info@monetize.li to request support or other inquiries.

DM [\@McGooserJr](https://twitter.com/Mcgooserjr) for any questions—and to stay updated with upcoming releases!
