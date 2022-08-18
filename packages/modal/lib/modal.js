"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolywalletModal = void 0;
const selector_1 = require("./selector");
const style_1 = require("./style");
const theme_1 = require("./theme");
const types_1 = require("./types");
class PolywalletModal {
    constructor(options) {
        this.options = options;
    }
    open(wallets) {
        if (wallets.length === 0) {
            return;
        }
        this.destroy();
        this.build(wallets);
        selector_1.SelectorUtility.getBackdrop().addEventListener('click', () => this.close());
        selector_1.SelectorUtility.getCloseButton().addEventListener('click', () => this.close());
        document.body.classList.add(selector_1.SelectorUtility.CLASSES.VISIBLE);
    }
    build(wallets) {
        var _a, _b, _c;
        const container = document.createElement('div');
        container.className = selector_1.SelectorUtility.CLASSES.CONTAINER;
        container.innerHTML = PolywalletModal.TEMPLATE;
        theme_1.ThemeUtility.configure(container, (_a = this.options) === null || _a === void 0 ? void 0 : _a.theme);
        document.body.appendChild(container);
        const mode = (_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.mode) !== null && _c !== void 0 ? _c : (wallets.length > 4
            ? types_1.PolywalletModalMode.Compact
            : types_1.PolywalletModalMode.Standard);
        if (mode === types_1.PolywalletModalMode.Compact) {
            const content = selector_1.SelectorUtility.getContent();
            content.className = selector_1.SelectorUtility.CLASSES.CONTENT_LARGE;
        }
        wallets.forEach((w) => this.buildButton(selector_1.SelectorUtility.getContentButtonContainer(), w, mode));
        const zIndex = this.getZIndex().toString();
        container.style.zIndex = zIndex;
        selector_1.SelectorUtility.getBackdrop().style.zIndex = zIndex;
        selector_1.SelectorUtility.getDialog().style.zIndex = zIndex;
    }
    buildButton(container, wallet, mode) {
        const options = wallet.authenticateButtonOptions;
        style_1.StyleUtility.build(options);
        const button = document.createElement('div');
        button.className =
            mode === types_1.PolywalletModalMode.Compact
                ? selector_1.SelectorUtility.CLASSES.CONTENT_BUTTON_SMALL
                : selector_1.SelectorUtility.CLASSES.CONTENT_BUTTON;
        button.className +=
            ' ' + selector_1.SelectorUtility.getContentButtonClass(options.label);
        button.innerText = options.label;
        button.onclick = () => wallet.authenticate();
        container.appendChild(button);
    }
    getZIndex() {
        const maxZIndex = Array.from(document.querySelectorAll('body *'))
            .map((e) => parseFloat(window.getComputedStyle(e).zIndex))
            .filter((e) => !isNaN(e))
            .sort()
            .pop();
        return maxZIndex ? Math.max(0, maxZIndex + 1) : 0;
    }
    close() {
        var _a, _b, _c;
        const content = selector_1.SelectorUtility.getContent();
        content === null || content === void 0 ? void 0 : content.addEventListener('animationend', () => this.destroy());
        content === null || content === void 0 ? void 0 : content.setAttribute('closed', '');
        (_a = selector_1.SelectorUtility.getBackdrop()) === null || _a === void 0 ? void 0 : _a.setAttribute('closed', '');
        (_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.afterClosed) === null || _c === void 0 ? void 0 : _c.call(_b);
    }
    destroy() {
        var _a;
        let style;
        while ((style = selector_1.SelectorUtility.getContentButtonStyle())) {
            document.head.removeChild(style);
        }
        const container = selector_1.SelectorUtility.getContainer();
        (_a = container === null || container === void 0 ? void 0 : container.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(container);
        document.body.classList.remove(selector_1.SelectorUtility.CLASSES.VISIBLE);
    }
}
exports.PolywalletModal = PolywalletModal;
PolywalletModal.TEMPLATE = `
    <div class="${selector_1.SelectorUtility.CLASSES.BACKDROP}"></div>
    <div class="${selector_1.SelectorUtility.CLASSES.DIALOG}">
      <div class="${selector_1.SelectorUtility.CLASSES.CONTENT}">
        <div class="${selector_1.SelectorUtility.CLASSES.CLOSE}">&times;</div>
        <h1 class="${selector_1.SelectorUtility.CLASSES.CONTENT_TITLE}">Connect Your Wallet</h1>
        <div class="${selector_1.SelectorUtility.CLASSES.CONTENT_BUTTON_CONTAINER}"></div>
        <div class="${selector_1.SelectorUtility.CLASSES.CONTENT_FOOTER}">Powered by Polywallet</div>
      </div>
    </div>`;
