import { DOCUMENTATION, MISCASED_ID_REGEX } from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `\`ID\` in \`displayName\` in node parameter must be fully uppercased. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_NAME}`,
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
        const isNodeParameter = id.isNodeParameter(node);
        const isOption = id.isOption(node);

        if (!isNodeParameter && !isOption) return;

        if (isNodeParameter) {
          const displayName = getters.nodeParam.getDisplayName(node);

          if (!displayName) return;

          if (MISCASED_ID_REGEX.test(displayName.value)) {
            context.report({
              messageId: "uppercaseId",
              node: displayName.ast,
              fix: (fixer) => {
                return fixer.replaceText(
                  displayName.ast,
                  `displayName: '${displayName.value.replace(/(id|Id)/, "ID")}'`
                );
              },
            });
          }
        } else if (isOption) {
          const name = getters.nodeParam.getName(node);

          if (!name) return;

          if (MISCASED_ID_REGEX.test(name.value)) {
            context.report({
              messageId: "uppercaseId",
              node: name.ast,
              fix: (fixer) => {
                return fixer.replaceText(
                  name.ast,
                  `name: '${name.value.replace(/(id|Id)/, "ID")}'`
                );
              },
            });
          }
        }
      },
    };
  },
});
