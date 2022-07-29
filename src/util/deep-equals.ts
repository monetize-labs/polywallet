export function deepEquals(array1: Uint8Array, array2: Uint8Array) {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  );
}
