export declare enum PolywalletModalMode {
    Compact = "COMPACT",
    Standard = "STANDARD"
}
export declare enum PolywalletModalTheme {
    Dark = "DARK",
    Light = "LIGHT"
}
export interface PolywalletModalOptions {
    mode?: PolywalletModalMode;
    theme?: PolywalletModalTheme;
    afterClosed?: () => void;
}
