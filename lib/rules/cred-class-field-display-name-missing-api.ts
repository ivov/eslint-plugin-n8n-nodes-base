import * as utils from "../ast";
import { identifiers as id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`displayName` field in credential class must be end with `API`.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      fixSuffix: "Append 'API' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node) {
        if (!id.isCredentialClass(node)) return;

        const displayName = getters.credClassBody.getDisplayName(node.body);

        if (!displayName) return;

        if (!displayName.value.endsWith(" API")) {
          const fixed = utils.addApiSuffix(displayName.value, {
            uppercased: true,
          });

          context.report({
            messageId: "fixSuffix",
            node: displayName.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                displayName.ast,
                `displayName = '${fixed}';`
              );
            },
          });
        }
      },
    };
  },
});
