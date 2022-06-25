import { TSESTree } from "@typescript-eslint/utils";
import { VERSION_REGEX } from "../../constants";
import { pipe } from "./functional";

// ----------------------------------
//           format items
// ----------------------------------

/**
 * Format items in options-type, multiOptions-type, or collection-type param.
 *
 * **Warning**: Fixed-collection-type param not supported.
 */
export function formatItems(obj: object, baseIndentation: string) {
  const str = JSON.stringify(obj, null, 2);

  const punctuated = pipe(addTrailingCommas, singleQuoteAll, unquoteKeys)(str);

  return indent(punctuated, baseIndentation);
}

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
        return baseIndentation + "\t".repeat(leadingWhitespace.length) + rest;
      }

      return baseIndentation + "\t".repeat(leadingWhitespace.length - 1) + rest;
    })
    .join("\n")
    .trim();
}


/**
 * Convert an object literal into a stringified object
 * without quotes on object keys.
 *
 * Modified from: https://stackoverflow.com/a/65443215
 *
 * Equivalent of `format` but for fixed collection.
 */
export function clean_OLD(obj: object, indentation: string) {
  // TODO: Refactor

  const clean = JSON.stringify(obj, null, 2)
    .replace(/\'/g, "\\'")
    .replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, (m) => m.replace(/"/g, "")) // unquote
    .replace(/"/g, "'")
    .replace(/\}\s/g, "},\n") // add trailing comma for last object
    .replace("]", "\t]")
    .replace(/ /g, "\t")
    .replace(/\tname:\t/g, "name: ")
    .replace(/\tvalue:\t/g, "value: ")
    .replace(/\tdisplayName:\t/g, "displayName: ")
    .replace(/\tdescription:\t/g, "description: ")
    .replace(/\tplaceholder:\t/g, "placeholder: ")
    .replace(/\toptions:\t/g, "options: ")
    .replace(/\ttype:\t/g, "type: ")
    .replace(/\tdefault:\t/g, "default: ")
    .replace(/(\.)\t\b/g, ". ")
    .replace(/\t\(/g, " (")
    .replace(/\t</g, " <")
    .replace(/\)\t/g, ") ")
    .replace(/,\t\b/g, ", ")
    .replace(/\t\\/g, " \\")
    .replace(/'\t/g, "' ")
    .replace(/\b\t\b/g, " ")
    .replace(/'\s\t/g, "',\n\t") // add trailing comma for last key-value pair
    .replace(/false\n/g, "false,\n") // add trailing comma for last key-value pair
    .replace(/true\n/g, "true,\n") // add trailing comma for last key-value pair
    .replace(/href=\\'/g, 'href="')
    .replace(/\\'>/g, '">')
    .replace(/\n/g, `\n${indentation}`)
    .replace(/\t{8}/gm, `${"\t".repeat(6)}`)
    .replace(/^\t{2}\]/gm, `${"\t".repeat(3)}\]`)
    .replace(/^\t{7}\]/gm, `${"\t".repeat(5)}\]`);

  return clean;
}

export function toDisplayOrder(options: Array<{ name: string }>) {
  return options
    .reduce<string[]>((acc, cur) => {
      return acc.push(cur.name), acc;
    }, [])
    .join(" | ");
}

// ----------------------------------
//           indentation
// ----------------------------------

export const getIndentationString = (referenceNode: {
  ast: TSESTree.BaseNode;
}) => {
  return "\t".repeat(referenceNode.ast.loc.start.column);
};

export const getBaseIndentationForOption = (referenceNode: {
  ast: TSESTree.BaseNode;
}) => {
  return "\t".repeat(referenceNode.ast.loc.start.column - 1);
};

// ----------------------------------
//           casing
// ----------------------------------

export function isKebabCase(str: string) {
  if (str !== str.toLowerCase()) return false;
  if (/\s/.test(str)) return false;
  if (!/-/.test(str)) return false;

  return str === str.toLowerCase().replace(/\s/g, "-");
}

/**
 * Whether a string is allowed to be lowercase and is therefore exempt from rules such as
 * `node-param-display-name-lowercase-first-char`, `node-param-display-name-miscased`, etc.
 */
export function isAllowedLowercase(value: string) {
  if (isUrl(value)) return true;

  if (isKebabCase(value)) return true;

  if (VERSION_REGEX.test(value)) return true;

  return ["bmp", "tiff", "gif", "jpg", "jpeg", "png"].includes(value);
}

function isUrl(str: string) {
  try {
    // tolerate absent protocol, respect intent
    if (["com", "org", "net", "io", "edu"].includes(str.slice(-3))) return true;

    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}


