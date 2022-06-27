import { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { getIndentationString } from "./format";
import { getRangeWithTrailingComma } from "./range";

export const getInsertionArgs = (referenceNode: { ast: TSESTree.BaseNode }) => {
  /**
   * This plugin is on ESLint 8, but n8n-workflow is still at ESLint 7.32,
   * which uses `ClassProperty` instead of `PropertyDefinition`. Hence these
   * checks are generalized for now, until n8n-workflow upgrades its ESLint to 8.
   */

  // field name has no trailing comma
  if (
    referenceNode.ast.type === AST_NODE_TYPES.PropertyDefinition ||
    // @ts-ignore
    referenceNode.ast.type === AST_NODE_TYPES.ClassProperty
  ) {
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

export function addApiSuffix(
  name: string,
  { uppercased } = { uppercased: false }
) {
  if (name.endsWith("Ap")) return uppercased ? `${name}I` : `${name}i`;
  if (name.endsWith("A")) return uppercased ? `${name}PI` : `${name}pi`;

  return uppercased ? `${name} API` : `${name}Api`;
}
