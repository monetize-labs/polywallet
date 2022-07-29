import { Polywallet } from '../types';
import { HandCashWallet } from '../wallets/handcash-wallet';
import { InvisibleMoneyButtonWallet } from '../wallets/invisible-moneybutton-wallet';
import { RelayXWallet } from '../wallets/relayx-wallet';
import {
  CLASSES,
  getBackdrop,
  getCloseButton,
  getContainer,
  getContent,
} from './selectors';

export class AuthModal {
  private static readonly BASE_CONTENT_HTML = `
    <div class="${CLASSES.BACKDROP}"></div>
    <div class="${CLASSES.DIALOG}">
      <div class="${CLASSES.CONTENT}">
        <div class="${CLASSES.CLOSE}">&times;</div>
        <h1 class="${CLASSES.CONTENT_TITLE}">Connect Your Wallet</h1>
      </div>
    </div>`;

  public static open(wallets: Polywallet.EncryptablePaymailWallet[]): void {
    if (wallets.length === 0) {
      return;
    }

    AuthModal.destroy();

    AuthModal.buildContainerElement(wallets);
    getBackdrop()?.addEventListener('click', () => AuthModal.close());
    getCloseButton()?.addEventListener('click', () => AuthModal.close());
    document.body.classList.add(CLASSES.VISIBLE);
  }

  public static close(): void {
    const content: Element | null = getContent();

    content?.addEventListener('animationend', () => AuthModal.destroy());
    getBackdrop()?.setAttribute('closed', '');
    content?.setAttribute('closed', '');
  }

  private static destroy(): void {
    const container: Element | null = getContainer();
    container?.parentNode?.removeChild(container);
    document.body.classList.remove(CLASSES.VISIBLE);
  }

  private static buildContainerElement(
    wallets: Polywallet.EncryptablePaymailWallet[],
  ): void {
    const container: HTMLDivElement = document.createElement('div');
    container.className = CLASSES.CONTAINER;
    container.innerHTML = AuthModal.BASE_CONTENT_HTML;
    document.body.appendChild(container);
    const content = getContent();

    const handCashWallet = wallets.find((w) => w instanceof HandCashWallet);
    if (handCashWallet) {
      const handCashButton: HTMLDivElement = document.createElement('div');
      handCashButton.className = CLASSES.CONTENT_HAND_CASH_BUTTON;
      handCashButton.innerText = 'Connect with HandCash';
      handCashButton.onclick = () => handCashWallet.authenticate();
      content?.appendChild(handCashButton);
    }

    const moneyButtonWallet = wallets.find(
      (w) => w instanceof InvisibleMoneyButtonWallet,
    );
    if (moneyButtonWallet) {
      const moneyButton: HTMLDivElement = document.createElement('div');
      moneyButton.className = CLASSES.CONTENT_MONEY_BUTTON;
      moneyButton.innerText = 'Connect with Money Button';
      moneyButton.onclick = () => moneyButtonWallet.authenticate();
      content?.appendChild(moneyButton);
    }

    const relayXWallet = wallets.find((w) => w instanceof RelayXWallet);
    if (relayXWallet) {
      const relayXButton: HTMLDivElement = document.createElement('div');
      relayXButton.className = CLASSES.CONTENT_RELAY_X_BUTTON;
      relayXButton.innerText = 'Connect with RelayX';
      relayXButton.onclick = () => relayXWallet.authenticate();
      content?.appendChild(relayXButton);
    }
  }
}
