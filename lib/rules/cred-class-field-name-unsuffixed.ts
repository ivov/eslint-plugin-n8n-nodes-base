import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "`name` field in credential class must be suffixed with `-Api`.",
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

        const name = getters.credClassBody.getName(node.body);

        if (!name) return;

        if (!name.value.endsWith("Api")) {
          const fixed = utils.addApiSuffix(name.value);

          context.report({
            messageId: "fixSuffix",
            node: name.ast,
            fix: (fixer) => {
              return fixer.replaceText(name.ast, `name = '${fixed}';`);
            },
          });
        }
      },
    };
  },
});
