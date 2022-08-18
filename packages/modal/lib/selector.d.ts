export declare class SelectorUtility {
    static readonly CLASSES: {
        CONTAINER: string;
        BACKDROP: string;
        DIALOG: string;
        CONTENT: string;
        CONTENT_LARGE: string;
        CLOSE: string;
        CONTENT_TITLE: string;
        CONTENT_BUTTON_CONTAINER: string;
        CONTENT_BUTTON: string;
        CONTENT_BUTTON_SMALL: string;
        CONTENT_FOOTER: string;
        VISIBLE: string;
        DARK_THEME_MODIFIER: string;
        LIGHT_THEME_MODIFIER: string;
    };
    static getContentButtonClass(label: string): string;
    static getContainer(): HTMLDivElement | null;
    static getBackdrop(): HTMLDivElement | null;
    static getDialog(): HTMLDivElement | null;
    static getContent(): HTMLDivElement | null;
    static getContentButtonContainer(): HTMLDivElement | null;
    static getCloseButton(): HTMLDivElement | null;
    static getContentButtonStyle(): HTMLStyleElement | null;
}
