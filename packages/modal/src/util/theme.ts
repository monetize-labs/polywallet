import { SelectorUtility } from './selector';
import { PolywalletModalTheme } from '../types';

export class ThemeUtility {
  private static readonly DARK_COLOR_SCHEME_QUERY =
    '(prefers-color-scheme: dark)';
  private static hasChangeHandler = false;

  public static getPreferred(): PolywalletModalTheme {
    return window.matchMedia(ThemeUtility.DARK_COLOR_SCHEME_QUERY).matches
      ? PolywalletModalTheme.Dark
      : PolywalletModalTheme.Light;
  }

  public static configure(
    container: Element,
    themeOverride?: PolywalletModalTheme,
  ): void {
    let theme: PolywalletModalTheme;
    if (themeOverride === undefined) {
      theme = ThemeUtility.getPreferred();

      if (!ThemeUtility.hasChangeHandler) {
        window
          .matchMedia(ThemeUtility.DARK_COLOR_SCHEME_QUERY)
          .addEventListener('change', (ev: MediaQueryListEvent) => {
            const container: Element | null = SelectorUtility.getContainer();
            if (container) {
              const classModifier: string = ev.matches
                ? SelectorUtility.CLASSES.DARK_THEME_MODIFIER
                : SelectorUtility.CLASSES.LIGHT_THEME_MODIFIER;
              container.className =
                SelectorUtility.CLASSES.CONTAINER + classModifier;
            }
          });
        ThemeUtility.hasChangeHandler = true;
      }
    } else {
      theme = themeOverride;
    }

    const classModifier: string =
      theme === PolywalletModalTheme.Dark
        ? SelectorUtility.CLASSES.DARK_THEME_MODIFIER
        : SelectorUtility.CLASSES.LIGHT_THEME_MODIFIER;
    container.className += classModifier;
  }
}
