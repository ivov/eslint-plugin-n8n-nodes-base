import { DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`description\` in dynamic-multi-options-type node parameter must be \`${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DESCRIPTION}\``,
      recommended: "error",
    },
    schema: [],
    fixable: "code",
    messages: {
      useStandardDescription: `Replace with '${DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DESCRIPTION}' [autofixable]`,
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isMultiOptionsType(node)) return;

        const loadOptionsMethod = getters.nodeParam.getLoadOptionsMethod(node);

        if (!loadOptionsMethod) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        const expected = DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER.DESCRIPTION;

        if (
          !description.value.endsWith(expected) &&
          !description.value.endsWith(expected + ".")
        ) {
          const sentences = description.value
            .split(". ")
            .map((s) => (s.endsWith(".") ? s.slice(0, -1) : s));

          const fixed = utils.keyValue(
            "description",
            sentences.length === 1 && sentences[0] === ""
              ? expected
              : [...sentences, expected].join(". ") + "."
          );

          context.report({
            messageId: "useStandardDescription",
            node: description.ast,
            fix: (fixer) => fixer.replaceText(description.ast, fixed),
          });
        }
      },
    };
  },
});
