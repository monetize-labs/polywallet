import { Constructor, Polywallet } from './types';
export declare class WalletBuilder<W extends Polywallet.Wallet = Polywallet.Wallet> {
    private afterBuilt?;
    private handler?;
    private timeout;
    private wallets;
    private forceShowEnabled;
    with<C extends Constructor<C, W>>(ctor: C, ...args: ConstructorParameters<C>): this;
    withHandler(handler: (wallets: W[]) => void): this;
    withModal<C extends Constructor<C, M>, M extends Polywallet.AuthenticationModal>(ctor: C, ...args: ConstructorParameters<C>): this;
    forceShow(enabled: boolean): this;
    withTimeout(timeout: number): this;
    build(): Promise<W>;
    private getAuthenticatedWallet;
}
