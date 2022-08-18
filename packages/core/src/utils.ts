export async function asyncFind<T>(
  arr: T[],
  predicate: (arg: T) => Promise<boolean>,
): Promise<T | undefined> {
  for (const e of arr) {
    if (await predicate(e)) return e;
  }

  return undefined;
}

export function deepEquals(array1: Uint8Array, array2: Uint8Array): boolean {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  );
}

export function encodeBase64(buffer: Uint8Array): string {
  if (typeof window === 'undefined') {
    return Buffer.from(buffer).toString('base64');
  } else {
    return window.btoa(String.fromCharCode.apply(null, Array.from(buffer)));
  }
}

export function removeLeadingZeros(array: Uint8Array): Uint8Array {
  return array.filter(
    (
      (last) => (v) =>
        (last = last || !!v)
    )(false),
  );
}
