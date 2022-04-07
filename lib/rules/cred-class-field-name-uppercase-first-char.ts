import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "First char in `name` in credential class must be lowercase.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      uppercaseFirstChar: "Change first char to lowercase [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node) {
        if (!id.isCredentialClass(node)) return;

        const name = getters.credClassBody.getName(node.body);

        if (!name) return;

        if (/[A-Z]/.test(name.value.charAt(0))) {
          context.report({
            messageId: "uppercaseFirstChar",
            node: name.ast,
            fix: (fixer) => {
              const fixed =
                name.value.charAt(0).toLowerCase() + name.value.slice(1);

              return fixer.replaceText(name.ast, `name = '${fixed}';`);
            },
          });
        }
      },
    };
  },
});
