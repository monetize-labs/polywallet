export enum PolywalletModalMode {
  Compact = 'COMPACT',
  Standard = 'STANDARD',
}

export enum PolywalletModalTheme {
  Dark = 'DARK',
  Light = 'LIGHT',
}

export interface PolywalletModalOptions {
  mode?: PolywalletModalMode;
  theme?: PolywalletModalTheme;
  afterClosed?: () => void;
}
