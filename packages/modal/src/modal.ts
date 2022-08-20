import { Polywallet } from '@polywallet/core';
import { SelectorUtility } from './util/selector';
import { StyleUtility } from './util/style';
import { ThemeUtility } from './util/theme';
import { PolywalletModalMode, PolywalletModalOptions } from './types';

export class PolywalletModal implements Polywallet.AuthenticationModal {
  private static readonly TEMPLATE: string = `
    <div class="${SelectorUtility.CLASSES.BACKDROP}"></div>
    <div class="${SelectorUtility.CLASSES.DIALOG}">
      <div class="${SelectorUtility.CLASSES.CONTENT}">
        <div class="${SelectorUtility.CLASSES.CLOSE}">&times;</div>
        <h1 class="${SelectorUtility.CLASSES.CONTENT_TITLE}">Connect Your Wallet</h1>
        <div class="${SelectorUtility.CLASSES.CONTENT_BUTTON_CONTAINER}"></div>
        <div class="${SelectorUtility.CLASSES.CONTENT_FOOTER}">Powered by Polywallet</div>
      </div>
    </div>`;

  public constructor(private options?: PolywalletModalOptions) {}

  public open<W extends Polywallet.Wallet>(wallets: W[]): void {
    if (wallets.length === 0) {
      return;
    }

    this.destroy();

    this.build(wallets);

    SelectorUtility.getBackdrop()!.addEventListener('click', () =>
      this.close(),
    );
    SelectorUtility.getCloseButton()!.addEventListener('click', () =>
      this.close(),
    );

    document.body.classList.add(SelectorUtility.CLASSES.VISIBLE);
    document.body.style.paddingRight = StyleUtility.getScrollbarWidth();
  }

  private build<W extends Polywallet.Wallet>(wallets: W[]): void {
    const container: HTMLDivElement = document.createElement('div');
    container.className = SelectorUtility.CLASSES.CONTAINER;
    container.innerHTML = PolywalletModal.TEMPLATE;
    ThemeUtility.configure(container, this.options?.theme);
    document.body.appendChild(container);

    const mode =
      this.options?.mode ??
      (wallets.length > 4
        ? PolywalletModalMode.Compact
        : PolywalletModalMode.Standard);
    if (mode === PolywalletModalMode.Compact) {
      const content: HTMLDivElement = SelectorUtility.getContent()!;
      content.className = SelectorUtility.CLASSES.CONTENT_LARGE;
    }

    wallets.forEach((w) =>
      this.buildButton(SelectorUtility.getContentButtonContainer()!, w, mode),
    );

    const zIndex: string = this.getZIndex().toString();
    container.style.zIndex = zIndex;
    SelectorUtility.getBackdrop()!.style.zIndex = zIndex;
    SelectorUtility.getDialog()!.style.zIndex = zIndex;
  }

  private buildButton<W extends Polywallet.Wallet>(
    container: HTMLDivElement,
    wallet: W,
    mode: PolywalletModalMode,
  ): void {
    const options: Polywallet.AuthenticateButtonOptions =
      wallet.authenticateButtonOptions;
    StyleUtility.build(options);

    const button: HTMLDivElement = document.createElement('div');
    button.className =
      mode === PolywalletModalMode.Compact
        ? SelectorUtility.CLASSES.CONTENT_BUTTON_SMALL
        : SelectorUtility.CLASSES.CONTENT_BUTTON;
    button.className +=
      ' ' + SelectorUtility.getContentButtonClass(options.label);
    button.innerText = options.label;
    button.onclick = () => wallet.authenticate();
    container.appendChild(button);
  }

  private getZIndex(): number {
    const maxZIndex: number | undefined = Array.from(
      document.querySelectorAll('body *'),
    )
      .map((e: Element) => parseFloat(window.getComputedStyle(e).zIndex))
      .filter((e: number) => !isNaN(e))
      .sort()
      .pop();
    return maxZIndex ? Math.max(0, maxZIndex + 1) : 0;
  }

  public close(): void {
    const content: Element | null = SelectorUtility.getContent();
    content?.addEventListener('animationend', () => this.destroy());
    content?.setAttribute('closed', '');
    SelectorUtility.getBackdrop()?.setAttribute('closed', '');
    this.options?.afterClosed?.();
  }

  private destroy(): void {
    let style: HTMLStyleElement | null;
    while ((style = SelectorUtility.getContentButtonStyle())) {
      document.head.removeChild(style);
    }

    const container: Element | null = SelectorUtility.getContainer();
    container?.parentNode?.removeChild(container);

    document.body.classList.remove(SelectorUtility.CLASSES.VISIBLE);
    document.body.style.paddingRight = '0';
  }
}
