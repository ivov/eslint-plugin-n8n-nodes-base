import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { isPlural, plural, singular } from "pluralize";
import { OptionsProperty } from "../types";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "Option `name` for a Resource node parameter must be singular.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      useSingular: "Use singular [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isResource(node)) return;

        const options = getters.nodeParam.getOptions(node);

        if (!options) return;

        const pluralOption = findPluralOption(options);

        if (pluralOption && !isAllowedPlural(pluralOption.value)) {
          const singularized = singular(pluralOption.value);
          const fixed = utils.keyValue("name", singularized);

          context.report({
            messageId: "useSingular",
            node: pluralOption.ast,
            fix: (fixer) => fixer.replaceText(pluralOption.ast, fixed),
          });
        }
      },
    };
  },
});

function findPluralOption(options: { ast: OptionsProperty }) {
  for (const element of options.ast.value.elements) {
    for (const property of element.properties) {
      if (
        property.type === AST_NODE_TYPES.Property &&
        property.computed === false &&
        property.key.type === AST_NODE_TYPES.Identifier &&
        property.key.name === "name" &&
        property.value.type === AST_NODE_TYPES.Literal &&
        typeof property.value.value === "string" &&
        isPlural(property.value.value) &&
        singular(property.value.value) !== plural(property.value.value) && // ignore if noun with identical singular and plural forms, e.g. software, information
        property.value.value !== 'SMS'
      )
        return {
          ast: property,
          value: property.value.value,
        };
    }
  }

  return null;
}

function isAllowedPlural(value: string) {
  return value.toLowerCase().endsWith("data"); // single ad hoc exception for now
}
