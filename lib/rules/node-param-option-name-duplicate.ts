import { OptionsProperty } from "../types";
import * as utils from "../ast";
import { isName } from "../ast/identifiers/nodeParameter.identifiers";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "Option `name` in options-type node parameter must not be a duplicate.",
      recommended: "error",
    },
    schema: [],
    fixable: "code",
    messages: {
      removeDuplicate: "Remove duplicate option [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isOptionsType(node)) return;

        const options = getters.nodeParam.getOptions(node);

        if (!options) return;

        if (options.hasPropertyPointingToIdentifier) return;

        const duplicate = findDuplicateOptionName(options);

        if (duplicate) {
          const rangeToRemove = utils.getRangeToRemove({
            ast: duplicate.parentOptionAst,
          });

          context.report({
            messageId: "removeDuplicate",
            node: duplicate.parentOptionAst,
            fix: (fixer) => {
              return fixer.removeRange(rangeToRemove);
            },
          });
        }
      },
    };
  },
});

function findDuplicateOptionName(options: { ast: OptionsProperty }) {
  const seen = new Set();

  for (const element of options.ast.value.elements) {
    if (!Array.isArray(element.properties)) continue;

    for (const property of element.properties) {
      if (!isName(property)) continue;

      const { value } = property.value;
      if (!seen.has(value)) {
        seen.add(value);
      } else {
        return { value, ast: property, parentOptionAst: element };
      }
    }
  }

  return null;
}
