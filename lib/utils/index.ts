import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { TSESTree } from "@typescript-eslint/utils";
// @ts-ignore
import DocRuleTester from "eslint-docgen/src/rule-tester";

export const createRule = ESLintUtils.RuleCreator((ruleName) => {
  return `https://github.com/ivov/eslint-plugin-PENDING/docs/rules/${ruleName}`;
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

export function areIdenticallySorted<
  T extends { name: string; value: string } | { displayName: string }
>(first: T[], second: T[]) {
  for (let i = 0; i < first.length; i++) {
    if (first[i] !== second[i]) return false;
  }

  return true;
}

/**
 * Convert an object literal into a stringified object
 * without quotes on object keys.
 *
 * Modified from: https://stackoverflow.com/a/65443215
 */
export function unquoteKeys(obj: object) {
  const cleaned = JSON.stringify(obj, null, 2);

  return cleaned
    .replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, (m) => m.replace(/"/g, "")) // unquote
    .replace(/"/g, "'") // adjust to single quotes
    .replace(/'\s/g, "',\n") // add trailing comma for last key-value pair
    .replace(/\}\s/, "},\n"); // add trailing comma for last object
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

export function isNodeFile(fullPath: string) {
  if (isTestRun) return true;

  return getNodeFilename(fullPath).endsWith(".node.ts");
}

export function isRegularNodeFile(filePath: string) {
  if (isTestRun) return true;

  const filename = getNodeFilename(filePath);

  return filename.endsWith(".node.ts") && !filename.endsWith("Trigger.node.ts");
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
  return " ".repeat(referenceNode.ast.loc.start.column);
};

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
