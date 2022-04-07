import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`placeholder` for a URL in credential class must be prepended with `e.g.`.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      prependEg: "Prepend 'e.g.' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node) {
        if (!id.isCredentialClass(node)) return;

        const placeholder = getters.credClassBody.getPlaceholder(node.body);

        if (!placeholder) return;

        if (placeholder.value.startsWith("http")) {
          context.report({
            messageId: "prependEg",
            node: placeholder.ast,
            fix: (fixer) => {
              return fixer.replaceText(
                placeholder.ast,
                `placeholder = 'e.g. ${placeholder.value}';`
              );
            },
          });
        }
      },
    };
  },
});
