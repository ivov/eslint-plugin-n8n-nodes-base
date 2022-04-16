import { DOCUMENTATION, MISCASED_ID_REGEX } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`ID\` in \`description\` in node parameter must be fully uppercased. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION}`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      uppercaseId: "Use 'ID' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node) && !id.isOption(node)) return;

        const loadOptionsMethod = getters.nodeParam.getLoadOptionsMethod(node);

        // to prevent overlap with node-param-description-wrong-for-dynamic-options
        if (loadOptionsMethod) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        if (MISCASED_ID_REGEX.test(description.value)) {
          const correctlyCased = description.value.replace(/(id|Id)/g, "ID");
          const fixed = utils.keyValue("description", correctlyCased);

          context.report({
            messageId: "uppercaseId",
            node: description.ast,
            fix: (fixer) => fixer.replaceText(description.ast, fixed),
          });
        }
      },
    };
  },
});
