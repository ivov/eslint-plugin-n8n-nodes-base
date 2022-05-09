/**
 * Format items in options-type, multiOptions-type, or collection-type param.
 *
 * **Warning**: Fixed-collection-type param not supported.
 */
export function format(obj: object, baseIndentation: string) {
  const str = JSON.stringify(obj, null, 2);

  const punctuated = pipe(addTrailingCommas, singleQuoteAll, unquoteKeys)(str);

  return indent(punctuated, baseIndentation);
}

const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (x: T) =>
    fns.reduce((v, f) => f(v), x);

function addTrailingCommas(str: string) {
  return str
    .replace(/(\})(\s)/g, "$1,$2") // trailing comma after final }
    .replace(/(\])(\s)/g, "$1,$2") // trailing comma after final ]
    .replace(/(\s+)(\},)/g, ",$1$2"); // trailing comma final key-value pair
}

function singleQuoteAll(str: string) {
  return str
    .replace(/'/g, "\\'") // escape preexisting single quotes
    .replace(/"/g, "'");
}

function unquoteKeys(str: string) {
  return str.replace(/'(.*)':/g, "$1:");
}

function indent(str: string, baseIndentation: string) {
  return str
    .split("\n")
    .map((line) => {
      const match = line.match(/^(?<leadingWhitespace>\s*)(?<rest>.*)/);

      if (!match || !match.groups) return line;

      const { leadingWhitespace, rest } = match.groups;

      if (!rest) return line;

      // `JSON.stringify()` turned all tab chars into whitespace
      // so restore leading whitespace into tab chars

      if (!leadingWhitespace) {
        return baseIndentation + "\t" + rest;
      }

      if (rest.startsWith("{") || rest.startsWith("}")) {
        const indent = "\t".repeat(leadingWhitespace.length);

        return baseIndentation + indent + rest;
      }

      const indent = "\t".repeat(leadingWhitespace.length - 1);

      return baseIndentation + indent + rest;
    })
    .join("\n")
    .trim();
}
