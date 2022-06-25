import * as utils from "../ast";
import { identifiers as id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "Credential class name must mention `OAuth2` if applicable.",
      recommended: "error",
    },
    schema: [],
    messages: {
      addOAuth2: "Insert 'OAuth2' [non-autofixable]", // unpredictable input
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node) {
        if (!id.isCredentialClass(node)) return;

        const extendsOAuth2 = getters.credClassBody.getExtendsOAuth2(node.body);

        if (!extendsOAuth2) return;

        const className = getters.getClassName(node);

        if (!className) return;

        if (
          extendsOAuth2.value.includes("oAuth2Api") &&
          !className.value.endsWith("OAuth2Api")
        ) {
          context.report({
            messageId: "addOAuth2",
            node: className.ast,
          });
        }
      },
    };
  },
});
