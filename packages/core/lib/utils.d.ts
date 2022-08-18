export declare function asyncFind<T>(arr: T[], predicate: (arg: T) => Promise<boolean>): Promise<T | undefined>;
export declare function deepEquals(array1: Uint8Array, array2: Uint8Array): boolean;
export declare function encodeBase64(buffer: Uint8Array): string;
export declare function removeLeadingZeros(array: Uint8Array): Uint8Array;
