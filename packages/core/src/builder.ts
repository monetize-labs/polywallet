import { Constructor, Polywallet } from './types';
import { asyncFind } from './utils';
import { waitUntil } from 'async-wait-until';

/**
 * Fluent wallet builder.
 *
 * @typeParam W - Type of wallets the builder can support.
 */
export class WalletBuilder<W extends Polywallet.Wallet = Polywallet.Wallet> {
  private afterBuilt?: () => void;
  private handler?: (wallets: W[]) => void;
  /** Defaults to 10 minutes. */
  private timeout = 600_000;
  private wallets: W[] = [];
  private forceShowEnabled = false;

  /**
   * Creates a wallet builder with the given wallet.
   *
   * @param ctor The constructor for the wallet.
   * @param args The arguments for the wallet constructor.
   * @returns The wallet builder.
   */
  public with<C extends Constructor<C, W>>(
    ctor: C,
    ...args: ConstructorParameters<C>
  ): this {
    this.wallets.push(new ctor(...args));
    return this;
  }

  /**
   * Creates a wallet builder with a custom handler that is invoked before the modal
   * is invoked. This will only be called if the modal is meant to be shown.
   *
   * @param handler The authentication handler function.
   * @returns The wallet builder.
   */
  public withHandler(handler: (wallets: W[]) => void): this {
    this.handler = handler;
    return this;
  }

  /**
   * Creates a wallet builder with the given authentication modal that is
   * invoked when all wallets are unauthenticated.
   *
   * @typeParam M - Type of modal the builder can support.
   * @param ctor The constructor for the authentication modal.
   * @param args The arguments for the authentication modal.
   * @returns The wallet builder.
   */
  public withModal<
    C extends Constructor<C, M>,
    M extends Polywallet.AuthenticationModal,
  >(ctor: C, ...args: ConstructorParameters<C>): this {
    const modal: M = new ctor(...args);
    this.handler = (wallets: W[]) => modal.open(wallets);
    this.afterBuilt = () => modal.close();
    return this;
  }

  /**
   * If enabled this will force the modal to show regardless of whether or not
   * there exists an authenticated wallet. The default behaviour is to treat this
   * as not enabled.
   *
   * @param enabled The boolean that determines whether forceShow is enabled or not
   */
  public forceShow(enabled: boolean): this {
    this.forceShowEnabled = enabled;
    return this;
  }

  /**
   * Creates a wallet builder with the given authentication timeout. This
   * specifies how long the builder should keep trying to find an authenticated
   * wallet.
   *
   * @param timeout Timeout in milliseconds.
   * @returns The wallet builder.
   */
  public withTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }

  /**
   * Builds a wallet using the given builder parameters.
   *
   * Throws an error when no wallet is provided or unable to find an authenticated wallet after timeout.
   *
   * @returns A wallet.
   */
  public async build(): Promise<W> {
    if (this.wallets.length === 0) {
      throw new Error('At least one wallet is required.');
    }

    let wallet: W | undefined = await this.getAuthenticatedWallet();
    if (wallet && !this.forceShowEnabled) {
      return wallet;
    }

    this.handler?.(this.wallets);

    await waitUntil(
      async () => !!(wallet = await this.getAuthenticatedWallet()),
      { timeout: this.timeout },
    );
    if (!wallet) {
      throw new Error('Unable to find an authenticated wallet.');
    }

    this.afterBuilt?.();
    return wallet;
  }

  private async getAuthenticatedWallet(): Promise<W | undefined> {
    return asyncFind(this.wallets, (w: W) => w.isAuthenticated());
  }
}
