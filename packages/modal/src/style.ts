import { Polywallet } from '@polywallet/core';
import { SelectorUtility } from './selector';

export class StyleUtility {
  public static build(options: Polywallet.AuthenticateButtonOptions): void {
    const baseColorStops: string = options.color.base.join(', ');
    const cssClass: string = SelectorUtility.getContentButtonClass(
      options.label,
    );
    const cssText = `
      .${cssClass} {
        background-image: linear-gradient(${baseColorStops});
      }
      .${cssClass}:active {
        background-image: linear-gradient(${baseColorStops});
      }
      .${cssClass}:before {
        background: url(${
          options.logo
        }) no-repeat scroll center center / 100% auto rgba(0, 0, 0, 0);
      }
      .${cssClass}:hover {
        background-image: linear-gradient(${options.color.hover.join(', ')});
      }
    `;

    const style: HTMLStyleElement = document.createElement('style');
    style.appendChild(document.createTextNode(cssText));
    style.id = 'styles-button-' + options.label.toLowerCase();
    document.querySelector('head')!.appendChild(style);
  }
}
