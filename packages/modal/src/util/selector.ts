export class SelectorUtility {
  public static readonly CLASSES = {
    CONTAINER: 'polywallet-modal',
    BACKDROP: 'polywallet-modal__backdrop',
    DIALOG: 'polywallet-modal__dialog',
    CONTENT: 'polywallet-modal__content',
    CONTENT_LARGE: 'polywallet-modal__content--large',
    CLOSE: 'polywallet-modal__close',
    CONTENT_TITLE: 'polywallet-modal__content-title',
    CONTENT_BUTTON_CONTAINER: 'polywallet-modal__content-button-container',
    CONTENT_BUTTON: 'polywallet-modal__content-button',
    CONTENT_BUTTON_SMALL: 'polywallet-modal__content-button--small',
    CONTENT_FOOTER: 'polywallet-modal__content-footer',
    VISIBLE: 'polywallet-modal--visible',
    DARK_THEME_MODIFIER: '--dark',
    LIGHT_THEME_MODIFIER: '--light',
  };

  public static getContentButtonClass(label: string): string {
    return (
      SelectorUtility.CLASSES.CONTENT_BUTTON +
      '-' +
      label.toLowerCase().replace(/\s/g, '-')
    );
  }

  public static getContainer(): HTMLDivElement | null {
    return document.body.querySelector(
      `div[class^="${SelectorUtility.CLASSES.CONTAINER}"]`,
    );
  }

  public static getBackdrop(): HTMLDivElement | null {
    return document.body.querySelector('.' + SelectorUtility.CLASSES.BACKDROP);
  }

  public static getDialog(): HTMLDivElement | null {
    return document.body.querySelector('.' + SelectorUtility.CLASSES.DIALOG);
  }

  public static getContent(): HTMLDivElement | null {
    return document.body.querySelector(
      `div[class^="${SelectorUtility.CLASSES.CONTENT}"]`,
    );
  }

  public static getContentButtonContainer(): HTMLDivElement | null {
    return document.body.querySelector(
      '.' + SelectorUtility.CLASSES.CONTENT_BUTTON_CONTAINER,
    );
  }

  public static getCloseButton(): HTMLDivElement | null {
    return document.body.querySelector('.' + SelectorUtility.CLASSES.CLOSE);
  }

  public static getContentButtonStyle(): HTMLStyleElement | null {
    return document.head.querySelector(`style[id^="styles-button-"]`);
  }
}
