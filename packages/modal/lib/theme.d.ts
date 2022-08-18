import { PolywalletModalTheme } from './types';
export declare class ThemeUtility {
    private static readonly DARK_COLOR_SCHEME_QUERY;
    private static hasChangeHandler;
    static getPreferred(): PolywalletModalTheme;
    static configure(container: Element, themeOverride?: PolywalletModalTheme): void;
}
