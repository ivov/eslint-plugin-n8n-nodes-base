import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "Credential class name must be suffixed with `-Api`.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      fixSuffix: "Suffix with '-Api' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node) {
        if (!id.isCredentialClass(node)) return;

        const className = getters.getClassName(node);

        if (!className) return;

        if (!className.value.endsWith("Api")) {
          const fixed = utils.addApiSuffix(className.value);

          context.report({
            messageId: "fixSuffix",
            node: className.ast,
            fix: (fixer) => {
              return fixer.replaceText(className.ast, fixed);
            },
          });
        }
      },
    };
  },
});
