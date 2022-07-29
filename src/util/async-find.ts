export async function asyncFind<T>(
  arr: T[],
  predicate: (arg: T) => Promise<boolean>,
): Promise<T | undefined> {
  for (let e of arr) {
    if (await predicate(e)) return e;
  }

  return undefined;
}
