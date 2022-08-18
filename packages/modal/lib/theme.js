"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeUtility = void 0;
const selector_1 = require("./selector");
const types_1 = require("./types");
class ThemeUtility {
    static getPreferred() {
        return window.matchMedia(ThemeUtility.DARK_COLOR_SCHEME_QUERY).matches
            ? types_1.PolywalletModalTheme.Dark
            : types_1.PolywalletModalTheme.Light;
    }
    static configure(container, themeOverride) {
        let theme;
        if (themeOverride === undefined) {
            theme = ThemeUtility.getPreferred();
            if (!ThemeUtility.hasChangeHandler) {
                window
                    .matchMedia(ThemeUtility.DARK_COLOR_SCHEME_QUERY)
                    .addEventListener('change', (ev) => {
                    const container = selector_1.SelectorUtility.getContainer();
                    if (container) {
                        const classModifier = ev.matches
                            ? selector_1.SelectorUtility.CLASSES.DARK_THEME_MODIFIER
                            : selector_1.SelectorUtility.CLASSES.LIGHT_THEME_MODIFIER;
                        container.className =
                            selector_1.SelectorUtility.CLASSES.CONTAINER + classModifier;
                    }
                });
                ThemeUtility.hasChangeHandler = true;
            }
        }
        else {
            theme = themeOverride;
        }
        const classModifier = theme === types_1.PolywalletModalTheme.Dark
            ? selector_1.SelectorUtility.CLASSES.DARK_THEME_MODIFIER
            : selector_1.SelectorUtility.CLASSES.LIGHT_THEME_MODIFIER;
        container.className += classModifier;
    }
}
exports.ThemeUtility = ThemeUtility;
ThemeUtility.DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
ThemeUtility.hasChangeHandler = false;
