import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";
import * as utils from "../utils";
import { COMMUNITY_PACKAGE_JSON } from "../constants";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `The \`description\` value in the \`package.json\` of a community package must be different from the default value \`${COMMUNITY_PACKAGE_JSON.DESCRIPTION}\`.`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      updateDescription: "Update the `description` key in package.json",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        const isTestRun = process.env.NODE_ENV === "test";
        const isProdRun = !isTestRun;
        const filename = context.getFilename();

        if (isProdRun && !filename.includes("package.json")) return;
        if (isProdRun && !id.prod.isTopLevelObjectExpression(node)) return;
        if (isTestRun && !id.test.isTopLevelObjectExpression(node)) return;

        const description = getters.packageJson.getDescription(node);

        if (!description) return;

        if (description.value === COMMUNITY_PACKAGE_JSON.DESCRIPTION) {
          context.report({
            messageId: "updateDescription",
            node,
          });
        }
      },
    };
  },
});
