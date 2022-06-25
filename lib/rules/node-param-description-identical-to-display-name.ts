import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`description` in node parameter must not be identical to `displayName`.",
      recommended: "error",
    },
    schema: [],
    fixable: 'code',
    messages: {
      removeDescription: "Remove omittable description [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        const description = getters.nodeParam.getDescription(node);

        if (!description) return;

        const displayName = getters.nodeParam.getDisplayName(node);

        if (!displayName) return;

        const triviaLess = description.value
          .replace(/^The\s/g, "")
          .replace(/\.$/, "");

        // console.log(triviaLess.toLocaleLowerCase);
        // console.log(displayName.value.toLowerCase());
        // console.log(
        //   triviaLess.toLowerCase() === displayName.value.toLowerCase()
        // );

        if (triviaLess.toLowerCase() === displayName.value.toLowerCase()) {
          const rangeToRemove = utils.getRangeToRemove(description);

          context.report({
            messageId: "removeDescription",
            node: description.ast,
            fix: (fixer) => fixer.removeRange(rangeToRemove),
          });
        }
      },
    };
  },
});
