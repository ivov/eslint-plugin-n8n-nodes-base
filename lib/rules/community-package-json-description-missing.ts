import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { utils } from "../ast/utils";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "The `description` key must be present in the `package.json` of a community package.",
      recommended: "error",
    },
    schema: [],
    messages: {
      addDescription: "Add a `description` key to package.json",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isCommunityPackageJson(context.getFilename(), node)) return;

        if (!getters.communityPackageJson.getDescription(node)) {
          context.report({
            messageId: "addDescription",
            node,
          });
        }
      },
    };
  },
});
