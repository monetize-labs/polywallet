import { Polywallet } from '@polywallet/core';
import { PolywalletModalOptions } from './types';
export declare class PolywalletModal implements Polywallet.AuthenticationModal {
    private options?;
    private static readonly TEMPLATE;
    constructor(options?: PolywalletModalOptions | undefined);
    open<W extends Polywallet.Wallet>(wallets: W[]): void;
    private build;
    private buildButton;
    private getZIndex;
    close(): void;
    private destroy;
}
