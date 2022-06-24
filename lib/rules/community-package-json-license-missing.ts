import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";
import * as utils from "../utils";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "The `description` key must be present in the `package.json` of a community package.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      addLicense: "Add a `license` key to package.json",
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

        if (!getters.packageJson.getLicense(node)) {
          context.report({
            messageId: "addLicense",
            node,
          });
        }
      },
    };
  },
});
