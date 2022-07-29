import bsvWasmInit from 'bsv-wasm-web';
import { AuthModal } from '../modal';
import { Polywallet } from '../types';
import { asyncFind } from '../util';
import {
  HandCashBuilderOptions,
  HandCashWallet,
} from '../wallets/handcash-wallet';
import {
  InvisibleMoneyButtonBuilderOptions,
  InvisibleMoneyButtonWallet,
} from '../wallets/invisible-moneybutton-wallet';
import { RelayXBuilderOptions, RelayXWallet } from '../wallets/relayx-wallet';

/**
 * Fluent builder for an encryptable paymail wallet.
 *
 * When one or more wallet builder options are provided,
 * a modal will be shown to allow the user to authenticate with the wallet provider.
 */
export class EncryptablePaymailWalletBuilder {
  private wallets: Polywallet.EncryptablePaymailWallet[] = [];

  withInvisibleMoneyButton(
    options: InvisibleMoneyButtonBuilderOptions,
  ): EncryptablePaymailWalletBuilder {
    this.wallets.push(new InvisibleMoneyButtonWallet(options));
    return this;
  }

  withHandCash(
    options: HandCashBuilderOptions,
  ): EncryptablePaymailWalletBuilder {
    this.wallets.push(new HandCashWallet(options));
    return this;
  }

  withRelayX(options: RelayXBuilderOptions): EncryptablePaymailWalletBuilder {
    this.wallets.push(new RelayXWallet(options));
    return this;
  }

  async build(): Promise<Polywallet.EncryptablePaymailWallet> {
    // This initializes BSV wasm for the whole library. It's important that
    // previous builder calls do not depend on bsv-wasm
    await bsvWasmInit();

    let authenticatedWallet = await asyncFind(this.wallets, (wallet) =>
      wallet.isAuthenticated(),
    );

    if (!authenticatedWallet) {
      AuthModal.open(this.wallets);
      return Promise.reject('Unauthenticated');
    }

    return authenticatedWallet!;
  }
}
