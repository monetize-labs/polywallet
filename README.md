![](https://raw.githubusercontent.com/monetize-labs/polywallet/main/images/logo.png)

No wallets are built the same—**Polywallet** resolves the ambiguities faced by developers using Bitcoin SV wallets.

**Polywallet** is an abstraction that enables you to keep your applications wallet agnostic and allow your customers the choice to select whichever wallet desired. Adapters for [HandCash](https://docs.handcash.io/docs), [RelayX](https://relayx.com/) and [Invisible Money Button](https://docs.moneybutton.com/docs/mb-invisible-money-button.html) are currently implemented for `EncryptablePaymailWallet`, the interface that your applications can depend on.

![Polywallet](https://raw.githubusercontent.com/monetize-labs/polywallet/main/images/modal.png)


## Wallets

| Wallet       |     Status      | Interfaces Supported                             |
| ------------ | :-------------: | ------------------------------------             |
| HandCash     |   **TESTED**    | Wallet, Balance, Encryption, Signatures, Paymail |
| Money Button |   **TESTED**    | Wallet, Balance, Encryption, Signatures, Paymail |
| RelayX       |   **TESTED**    | Wallet, Balance, Encryption, Signatures, Paymail |
| Sensilet     |   **TESTED**    | Wallet, Balance, Signatures                      |
| Twetch       |   **TESTED**    | Wallet, Signatures, Paymail                      |
| Volt         |   **TESTED**    | Wallet, Balance                                  |
| Dot          | **NOT PLANNED** | TBD                                              |
| Relysia      | **NOT PLANNED** | TBD                                              |


## Install (npm)

```sh
# Core (required)
npm install @polywallet/core
# Authentication modal (optional)
npm install @polywallet/modal
# Wallets (optional)
npm install @polywallet/handcash-adapter
npm install @polywallet/money-button-adapter
npm install @polywallet/relayx-adapter
npm install @polywallet/sensilet-adapter
npm install @polywallet/twetch-adapter
npm install @polywallet/volt-adapter
```

## Install (CDN)

```html
<script src="https://unpkg.com/@polywallet/bundle></script>
```

## Usage

### Import (npm)

```ts
import { Polywallet, WalletBuilder } from '@polywallet/core';
import { PolywalletModal } from '@polywallet/modal';
import { HandCashWallet } from '@polywallet/handcash-adapter';
import { MoneyButtonWallet } from '@polywallet/money-button-adapter';
import { RelayXWallet } from '@polywallet/relayx-adapter';
import { SensiletWallet } from '@polywallet/sensilet-adapter';
import { TwetchWallet } from '@polywallet/twetch-adapter';
import { VoltWallet } from '@polywallet/volt-adapter';
```

If you are using [@polywallet/modal](./packages/modal), include its stylesheet.

- Angular

  ```tsx
  // angular.json
  ...
  "styles": [
    ...,
    "node_modules/@polywallet/modal/lib/styles.css"
  ],
  ...
  ```

- React
  ```tsx
  // Next.js: pages/_app.tsx
  // React: src/App.tsx
  ...
  import '@polywallet/modal/lib/styles.css';
  ...
  ```

### Import (CDN)

All exported members will be exposed under the global variable `Polywallet`.
If you are using [@polywallet/modal](./packages/modal), its stylesheet will load automatically.

### Wallet Builders

```ts
// Wallet Type Aliases:
// - SignableWallet = Wallet + Balance + Signatures
// - PaymailWallet = SignableWallet + Paymail
// - PaymailWalletWithoutBalance = PaymailWallet - Balance
// - EncryptableWallet = PaymailWallet + Encryption

import { Polywallet, WalletBuilder } from '@polywallet/core';
import { PolywalletModal } from '@polywallet/modal';
import { HandCashWallet } from '@polywallet/handcash-adapter';
import { MoneyButtonWallet } from '@polywallet/money-button-adapter';
import { RelayXWallet } from '@polywallet/relayx-adapter';
import { SensiletWallet } from '@polywallet/sensilet-adapter';
import { TwetchWallet } from '@polywallet/twetch-adapter';
import { VoltWallet } from '@polywallet/volt-adapter';

const wallet = await new WalletBuilder<Polywallet.Wallet>()
  .with(HandCashWallet, { appId: 'APP_ID', appSecret: 'APP_SECRET' })
  .with(MoneyButtonWallet, { clientIdentifier: 'CLIENT_IDENTIFIER' })
  .with(RelayXWallet, { bitcomPrefix: 'BITCOM_PREFIX' })
  .with(SensiletWallet)
  .with(TwetchWallet)
  .with(VoltWallet)
  .withModal(PolywalletModal, {
    mode: 'COMPACT',
    theme: 'LIGHT',
  })
  .build();

const signableWallet = await new WalletBuilder<Polywallet.SignableWallet>()
  .with(HandCashWallet, { appId: 'APP_ID', appSecret: 'APP_SECRET' })
  .with(MoneyButtonWallet, { clientIdentifier: 'CLIENT_IDENTIFIER' })
  .with(RelayXWallet, { bitcomPrefix: 'BITCOM_PREFIX' })
  .with(SensiletWallet)
  .withModal(PolywalletModal, {
    mode: 'STANDARD',
    theme: 'DARK',
    afterClosed: () => console.log('Modal is closed!'),
  })
  .build();

const paymailWallet =
  await new WalletBuilder<Polywallet.PaymailWallet>()
    .with(HandCashWallet, { appId: 'APP_ID', appSecret: 'APP_SECRET' })
    .with(MoneyButtonWallet, { clientIdentifier: 'CLIENT_IDENTIFIER' })
    .with(RelayXWallet, { bitcomPrefix: 'BITCOM_PREFIX' })
    .withHandler((wallets) => {
      console.log('Authenticate manually!');
      wallets[0].authenticate();
    })
    .build();

const paymailWalletWithoutBalance =
  await new WalletBuilder<Polywallet.PaymailWalletWithoutBalance>()
    .with(HandCashWallet, { appId: 'APP_ID', appSecret: 'APP_SECRET' })
    .with(MoneyButtonWallet, { clientIdentifier: 'CLIENT_IDENTIFIER' })
    .with(RelayXWallet, { bitcomPrefix: 'BITCOM_PREFIX' })
    .with(TwetchWallet)
    .withHandler((wallets) => {
      console.log('Authenticate manually!');
      wallets[0].authenticate();
    })
    .build();

const encryptablePaymailWallet =
  await new WalletBuilder<Polywallet.EncryptablePaymailWallet>()
    .with(HandCashWallet, { appId: 'APP_ID', appSecret: 'APP_SECRET' })
    .with(MoneyButtonWallet, { clientIdentifier: 'CLIENT_IDENTIFIER' })
    .with(RelayXWallet, { bitcomPrefix: 'BITCOM_PREFIX' })
    .withModal(PolywalletModal)
    .build();
// Once we have the EncryptablePaymailWallet, we can do all these things
// regardless of which wallet the customer chose.
const meta = [109, 101, 116, 97];
await encryptablePaymailWallet.sign(meta);
await encryptablePaymailWallet.decrypt(await wallet.encrypt(meta));
await encryptablePaymailWallet.sendToBitcoinAddress(
  '11A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  1,
);
```

### Modal

The polywallet modal can also be opened and closed manually.

```ts
import { PolywalletModal } from '@polywallet/modal';

const wallet = new AnyWallet();
const modal = new PolywalletModal({
  mode: 'STANDARD',
  theme: 'DARK',
  afterClosed: () => console.log('Modal is closed!'),
});

modal.open([wallet]);
modal.close();
```
## Support

Reach out to us at info@monetize.li to request support or other inquiries.

DM [\@McGooserJr](https://twitter.com/Mcgooserjr) for any questions—and to stay updated with upcoming releases!
