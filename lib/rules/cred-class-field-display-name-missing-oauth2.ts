import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`displayName` field in credential class must mention `OAuth2` if the credential is OAuth2.",
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

        const displayName = getters.credClassBody.getDisplayName(node.body);

        if (!displayName) return;

        if (
          extendsOAuth2.value.includes("oAuth2Api") &&
          !displayName.value.endsWith("OAuth2 API")
        ) {
          context.report({
            messageId: "addOAuth2",
            node: displayName.ast,
          });
        }
      },
    };
  },
});
