import * as utils from "../ast";
import { identifiers as id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "`documentationUrl` field in credential class must be present.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      addDocumentationUrl: "Add `documentationUrl` [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node) {
        if (!id.isCredentialClass(node)) return;

        const { body: classBody } = node;

        const documentationUrl = getters.credClassBody.getDocumentationUrl(classBody);

        if (!documentationUrl) {
          const displayName = getters.credClassBody.getDisplayName(classBody); // insertion point

          if (!displayName) return;

          const className = getters.credClassBody.getName(classBody);

          if (!className) return;

          const { indentation, range } = utils.getInsertionArgs(displayName);

          context.report({
            messageId: "addDocumentationUrl",
            node: classBody,
            fix: (fixer) => {
              const fixed = className.value.replace(/(OAuth2)?Api/g, "");

              return fixer.insertTextAfterRange(
                range,
                `\n${indentation}documentationUrl = '${fixed}';`
              );
            },
          });
        }
      },
    };
  },
});
