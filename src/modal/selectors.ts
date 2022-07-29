export const CLASSES = {
  CONTAINER: 'auth-modal',
  BACKDROP: 'auth-modal__backdrop',
  DIALOG: 'auth-modal__dialog',
  CONTENT: 'auth-modal__content',
  CLOSE: 'auth-modal__close',
  CONTENT_TITLE: 'auth-modal__content-title',
  CONTENT_HAND_CASH_BUTTON: 'auth-modal__content--hand-cash-button',
  CONTENT_MONEY_BUTTON: 'auth-modal__content--money-button',
  CONTENT_RELAY_X_BUTTON: 'auth-modal__content--relay-x',
  VISIBLE: 'auth-modal--visible',
};

export const getContainer = (): Element | null =>
  document.body.querySelector('.' + CLASSES.CONTAINER);
export const getBackdrop = (): Element | null =>
  document.body.querySelector('.' + CLASSES.BACKDROP);
export const getContent = (): Element | null =>
  document.body.querySelector('.' + CLASSES.CONTENT);
export const getCloseButton = (): Element | null =>
  document.body.querySelector('.' + CLASSES.CLOSE);
