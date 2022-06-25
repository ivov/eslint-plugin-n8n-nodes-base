import { isPlural, singular } from "pluralize";
import { RESOURCE_DESCRIPTION_SUFFIX } from "../constants";
import * as utils from "../ast";
import { identifiers as id } from "../ast/identifiers";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "Resource description file must use singular form. Example: `UserDescription.ts`, not `UsersDescription.ts`.",
      recommended: "error",
    },
    schema: [],
    messages: {
      renameFile: "Rename file to {{ expected }} [non-autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        const filename = utils.getNodeFilename(context.getFilename());

        const parts = filename.split(RESOURCE_DESCRIPTION_SUFFIX);

        if (parts.length !== 2) return;

        const resourceName = parts.shift();

        if (resourceName && isPlural(resourceName)) {
          const topOfFile = { line: 1, column: 1 };

          context.report({
            messageId: "renameFile",
            loc: { start: topOfFile, end: topOfFile },
            data: {
              expected: singular(resourceName) + RESOURCE_DESCRIPTION_SUFFIX,
            },
          });
        }
      },
    };
  },
});
