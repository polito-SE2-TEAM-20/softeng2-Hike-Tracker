export const genArray = (n: number) => Array(n).fill(0);

export const mapArray = <T>(
  n: number,
  generator: (index: number) => Promise<T>,
) => Promise.all(genArray(n).map((_, i) => generator(i)));
