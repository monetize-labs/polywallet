"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleUtility = void 0;
const selector_1 = require("./selector");
class StyleUtility {
    static build(options) {
        const baseColorStops = options.color.base.join(', ');
        const cssClass = selector_1.SelectorUtility.getContentButtonClass(options.label);
        const cssText = `
      .${cssClass} {
        background-image: linear-gradient(${baseColorStops});
      }
      .${cssClass}:active {
        background-image: linear-gradient(${baseColorStops});
      }
      .${cssClass}:before {
        background: url(${options.logo}) no-repeat scroll center center / 100% auto rgba(0, 0, 0, 0);
      }
      .${cssClass}:hover {
        background-image: linear-gradient(${options.color.hover.join(', ')});
      }
    `;
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(cssText));
        style.id = 'styles-button-' + options.label.toLowerCase();
        document.querySelector('head').appendChild(style);
    }
}
exports.StyleUtility = StyleUtility;
