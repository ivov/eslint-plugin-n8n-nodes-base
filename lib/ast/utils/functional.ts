export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (x: T) =>
    fns.reduce((v, f) => f(v), x);
