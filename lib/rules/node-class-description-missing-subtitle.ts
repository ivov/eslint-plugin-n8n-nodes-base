import { NODE_CLASS_DESCRIPTION_SUBTITLE } from "../constants";
import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { TSESTree } from "@typescript-eslint/utils";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "`subtitle` in node class description must be present.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      addSubtitle: `Add subtitle: '${NODE_CLASS_DESCRIPTION_SUBTITLE}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeClassDescription(node)) return;

        const allDisplayNames = getAllDisplayNames(node);

        if (!allDisplayNames) return;

        // "Resource" and "Operation" required for subtitle
        const hasNoSubtitleComponents = !allDisplayNames.every((dn) =>
          ["Resource", "Operation"].includes(dn)
        );

        if (hasNoSubtitleComponents) return;

        if (!getters.nodeClassDescription.getSubtitle(node)) {
          const version =
            getters.nodeClassDescription.getVersion(node) ??
            getters.nodeClassDescription.getDefaultVersion(node); // legacy node

          if (!version) return;

          const { range, indentation } = utils.getInsertionArgs(version);

          context.report({
            messageId: "addSubtitle",
            node,
            fix: (fixer) =>
              fixer.insertTextAfterRange(
                range,
                `\n${indentation}subtitle: '${NODE_CLASS_DESCRIPTION_SUBTITLE}',`
              ),
          });
        }
      },
    };
  },
});

function getAllDisplayNames(nodeParam: TSESTree.ObjectExpression) {
  const properties = nodeParam.properties.find(
    id.nodeClassDescription.isProperties
  );

  if (!properties) return null;

  const displayNames = properties.value.elements.reduce<string[]>(
    (acc, element) => {
      const found = element.properties?.find(id.nodeParam.isDisplayName);

      if (found) acc.push(found.value.value);

      return acc;
    },
    []
  );

  if (!displayNames.length) return null;

  return displayNames;
}
