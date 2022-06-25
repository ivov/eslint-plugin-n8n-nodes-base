import { OptionsProperty } from "../types";
import * as utils from "../ast";
import { identifiers as id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`name` under `credentials` in node class description must be suffixed with `-Api`.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      fixSuffix: "Suffix with `-Api` [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeClassDescription(node)) return;

        const credOptions = getters.nodeClassDescription.getCredOptions(node);

        if (!credOptions) return;

        const unsuffixed = getUnsuffixedCredOptionName(credOptions);

        if (unsuffixed) {
          const suffixed = utils.addApiSuffix(unsuffixed.value);
          const fixed = utils.keyValue("name", suffixed);

          context.report({
            messageId: "fixSuffix",
            node: unsuffixed.ast,
            fix: (fixer) => fixer.replaceText(unsuffixed.ast, fixed),
          });
        }
      },
    };
  },
});

export function getUnsuffixedCredOptionName(credOptions: {
  ast: OptionsProperty;
}) {
  for (const credOption of credOptions.ast.value.elements) {
    for (const property of credOption.properties) {
      if (
        id.nodeClassDescription.isName(property) &&
        typeof property.value.value === "string" &&
        !property.value.value.endsWith("Api")
      ) {
        return {
          ast: property,
          value: property.value.value,
        };
      }
    }
  }

  return null;
}
