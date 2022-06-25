/* eslint-disable import/no-extraneous-dependencies */

import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { TSESTree } from "@typescript-eslint/utils";
// @ts-ignore
import DocRuleTester from "eslint-docgen/src/rule-tester";
import { VERSION_REGEX, WEAK_DESCRIPTIONS } from "../constants";

export { format } from "./format";

export const createRule = ESLintUtils.RuleCreator((ruleName) => {
  return `https://github.com/ivov/eslint-plugin-n8n-nodes-base/blob/master/docs/rules/${ruleName}.md`;
});

export const getRuleName = ({ filename }: { filename: string }) =>
  filename
    .split("/")
    .pop()
    ?.replace(/(\.test)?\.(j|t)s/, "") ?? "Unknown";

export const ruleTester = () =>
  new DocRuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

export function toExpectedNodeFilename(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1) + ".node.ts";
}

export function areIdenticallySortedOptions(
  first: { name: string }[],
  second: { name: string }[]
) {
  for (let i = 0; i < first.length; i++) {
    if (first[i].name !== second[i].name) return false;
  }

  return true;
}

export function toDisplayOrder(options: Array<{ name: string }>) {
  return options
    .reduce<string[]>((acc, cur) => {
      return acc.push(cur.name), acc;
    }, [])
    .join(" | ");
}

export function optionComparator(a: { name: string }, b: { name: string }) {
  // if version, sort in descending order
  if (VERSION_REGEX.test(a.name)) {
    if (a.name === b.name) return 0;
    return parseFloat(a.name.slice(1)) > parseFloat(b.name.slice(1)) ? -1 : 1;
  }

  return a.name.localeCompare(b.name);
}

export function areIdenticallySortedParams(
  first: { displayName: string }[],
  second: { displayName: string }[]
) {
  for (let i = 0; i < first.length; i++) {
    if (first[i].displayName !== second[i].displayName) return false;
  }

  return true;
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

export function addApiSuffix(
  name: string,
  { uppercased } = { uppercased: false }
) {
  if (name.endsWith("Ap")) return uppercased ? `${name}I` : `${name}i`;
  if (name.endsWith("A")) return uppercased ? `${name}PI` : `${name}pi`;

  return uppercased ? `${name} API` : `${name}Api`;
}

// ----------------------------------
//            filenames
// ----------------------------------

const isTestRun = process.env.NODE_ENV === "test";

export function getNodeFilename(fullPath: string) {
  if (isTestRun) return "Test.node.ts";

  const filename = fullPath.split("/").pop();

  if (!filename) {
    throw new Error(`Failed to extract node filename from path: ${fullPath}`);
  }

  return filename;
}

function getRangeWithTrailingComma(referenceNode: { ast: TSESTree.BaseNode }) {
  const { range } = referenceNode.ast;

  return [range[0], range[1] + 1] as const; // `+ 1` to include trailing comma
}

export function isCredentialFile(fullPath: string) {
  if (isTestRun) return true;

  return getNodeFilename(fullPath).endsWith(".credentials.ts");
}

export function isNodeFile(fullPath: string) {
  if (isTestRun) return true;

  return getNodeFilename(fullPath).endsWith(".node.ts");
}

export function isRegularNodeFile(filePath: string) {
  if (isTestRun) return true;

  const filename = getNodeFilename(filePath);

  return (
    filename.endsWith(".node.ts") &&
    !filename.endsWith("Trigger.node.ts") &&
    !filename.endsWith("EmailReadImap.node.ts") // trigger node without trigger in the name
  );
}

export function isTriggerNodeFile(filePath: string) {
  if (isTestRun) return true;

  return getNodeFilename(filePath).endsWith("Trigger.node.ts");
}

export function isCredClassFile(filePath: string) {
  if (isTestRun) return true;

  return getNodeFilename(filePath).endsWith(".credentials.ts");
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

/**
 * Get full range of type assertion for its removal.
 *
 * `- 4` to grab the initial `as` keyword and its two whitespaces
 *
 * ```ts
 * type: "string" as NodePropertyTypes,
 *            // ^-------------------^
 * ```
 */
export function getRangeOfAssertion(typeIdentifier: TSESTree.Identifier) {
  return [typeIdentifier.range[0] - 4, typeIdentifier.range[1]] as const;
}

export function getRangeToRemove(referenceNode: { ast: TSESTree.BaseNode }) {
  const { range } = referenceNode.ast;
  const indentation = getIndentationString(referenceNode);

  if (referenceNode.ast.type === AST_NODE_TYPES.TSArrayType) {
    // `- 1` to offset closing square bracket
    return [range[0] - indentation.length, range[1] - 1] as const;
  }

  // `+ 2` to include trailing comma and empty line
  return [range[0] - indentation.length, range[1] + 2] as const;
}

export const getInsertionArgs = (referenceNode: { ast: TSESTree.BaseNode }) => {
  // field name has no trailing comma
  if (referenceNode.ast.type === AST_NODE_TYPES.PropertyDefinition) {
    return {
      range: referenceNode.ast.range,
      indentation: getIndentationString(referenceNode),
    };
  }

  return {
    range: getRangeWithTrailingComma(referenceNode),
    indentation: getIndentationString(referenceNode),
  };
};

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

export function isKebabCase(str: string) {
  if (str !== str.toLowerCase()) return false;
  if (/\s/.test(str)) return false;
  if (!/-/.test(str)) return false;

  return str === str.toLowerCase().replace(/\s/g, "-");
}

export function isMultiline(node: { ast: TSESTree.BaseNode; value: string }) {
  return node.ast.loc.start.line !== node.ast.loc.end.line;
}

/**
 * Create a key-value pair to insert in an object.
 *
 * Formatting:
 * - Unquoted key
 * - Single-quoted value, with existing unescaped inner single quotes escaped. Optionally, backticked value.
 *
 * ```ts
 * keyValue("displayName", "User's Name"); // → "displayName: 'User\\'s Name'"
 * ```
 */
export function keyValue(
  key: "displayName" | "name" | "description" | "type" | "placeholder",
  value: string,
  { backtickedValue } = { backtickedValue: false }
) {
  const unescapedQuote = new RegExp(/(?<!\\)'/, "g"); // only if not already escaped
  const escapedValue = value.replace(unescapedQuote, "\\'");

  if (backtickedValue) {
    return `${key}: \`${escapedValue}\``;
  }

  return `${key}: '${escapedValue}'`;
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

/**
 * Add end segment to display name of dynamic options-type or multi-options-type node parameter.
 */
export function addEndSegment(value: string) {
  if (/\w+\sName(s?)\s*\/\s*ID(s?)/.test(value))
    return value.replace(/Name(s?)\s*\/\s*ID(s?)/, "Name or ID");

  if (/\w+\sID(s?)\s*\/\s*Name(s?)/.test(value))
    return value.replace(/ID(s?)\s*\/\s*Name(s?)/, "Name or ID");

  if (/\w+\sName(s?)$/.test(value))
    return value.replace(/Name(s?)$/, "Name or ID");

  if (/\w+\sID(s?)$/.test(value)) return value.replace(/ID(s?)$/, "Name or ID");

  if (value === "ID" || value === "Name") return "Name or ID";

  if (/Name or/.test(value)) return value.replace("Name or", "Name or ID");

  return value.concat(" Name or ID");
}
