import {
  MIN_ITEMS_TO_ALPHABETIZE,
  MIN_ITEMS_TO_ALPHABETIZE_IN_FULL,
} from "../constants";
import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `Items in a fixed-collection-type node parameter section must be alphabetized by \`displayName\` if ${MIN_ITEMS_TO_ALPHABETIZE_IN_FULL} or more than ${MIN_ITEMS_TO_ALPHABETIZE_IN_FULL}, unless the items are address fields.`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      sortItems:
        "Alphabetize by 'displayName'. Order: {{ displayOrder }} [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isFixedCollectionSection(node)) return;

        if (isAddressFixedCollectionSection(node)) return;

        const values = getters.nodeParam.getFixedCollectionValues(node);

        if (!values) return;

        if (values.value.length < MIN_ITEMS_TO_ALPHABETIZE) return;

        // `values` are node params in a fixed collection
        const sortedParams = [...values.value].sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        );

        if (!utils.areIdenticallySortedParams(values.value, sortedParams)) {
          const baseIndentation = utils.getBaseIndentationForOption(values);

          const fixed = utils.clean_OLD(sortedParams, baseIndentation);

          const displayOrder = sortedParams
            .reduce<string[]>((acc, cur) => {
              return acc.push(cur.displayName), acc;
            }, [])
            .join(" | ");

          context.report({
            messageId: "sortItems",
            node: values.ast,
            data: { displayOrder },
            fix: (fixer) => fixer.replaceText(values.ast, `values: ${fixed}`),
          });
        }
      },
    };
  },
});

/**
 * Whether the node is a fixed collection section that contains address fields,
 * as signalled by the display name of the fixed collection section, or by the
 * display name of its containing fixed collection.
 */
function isAddressFixedCollectionSection(node: TSESTree.ObjectExpression) {
  for (const property of node.properties) {
    if (
      property.type === AST_NODE_TYPES.Property &&
      property.key.type === AST_NODE_TYPES.Identifier &&
      property.key.name === "displayName" &&
      property.value.type === AST_NODE_TYPES.Literal &&
      typeof property.value.value === "string" &&
      property.value.value.toLowerCase().includes("address")
    ) {
      return true;
    }

    // fixed collection _section_ does not mention "address",
    // but the containing fixed collection may mention it

    const fixedCollectionParam = property?.parent?.parent?.parent?.parent as
      | TSESTree.ObjectExpression
      | undefined;

    if (!fixedCollectionParam) continue;

    const displayName = getters.nodeParam.getDisplayName(fixedCollectionParam);

    if (!displayName) continue;

    if (displayName.value.toLowerCase().includes("address")) return true;
  }

  return false;
}
