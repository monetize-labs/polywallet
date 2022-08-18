"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorUtility = void 0;
class SelectorUtility {
    static getContentButtonClass(label) {
        return (SelectorUtility.CLASSES.CONTENT_BUTTON +
            '-' +
            label.toLowerCase().replace(/\s/g, '-'));
    }
    static getContainer() {
        return document.body.querySelector(`div[class^="${SelectorUtility.CLASSES.CONTAINER}"]`);
    }
    static getBackdrop() {
        return document.body.querySelector('.' + SelectorUtility.CLASSES.BACKDROP);
    }
    static getDialog() {
        return document.body.querySelector('.' + SelectorUtility.CLASSES.DIALOG);
    }
    static getContent() {
        return document.body.querySelector(`div[class^="${SelectorUtility.CLASSES.CONTENT}"]`);
    }
    static getContentButtonContainer() {
        return document.body.querySelector('.' + SelectorUtility.CLASSES.CONTENT_BUTTON_CONTAINER);
    }
    static getCloseButton() {
        return document.body.querySelector('.' + SelectorUtility.CLASSES.CLOSE);
    }
    static getContentButtonStyle() {
        return document.head.querySelector(`style[id^="styles-button-"]`);
    }
}
exports.SelectorUtility = SelectorUtility;
SelectorUtility.CLASSES = {
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
