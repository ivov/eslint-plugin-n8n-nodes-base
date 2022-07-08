import { utils } from "../ast/utils";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "In the `execute()` method in a node, `NodeApiError` and `NodeOperationError` must specify the `itemIndex` as the third argument.",
      recommended: "error",
    },
    schema: [],
    messages: {
      // TODO: Create autofix
      // TODO: Detect index name
      addItemIndexArgument:
        "Add `{ itemIndex: i } as third argument [non-autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ThrowStatement(node) {
        if (!utils.isNodeFile(context.getFilename())) return;

        // See comment about exceptions at node-execute-block-wrong-error-thrown

        // @ts-ignore
        const errorKind: string | undefined = node?.argument?.callee?.name;

        if (!errorKind) return;

        if (!["NodeApiError", "NodeOperationError"].includes(errorKind)) return;

        // @ts-ignore
        if (node?.argument?.arguments?.length < 3) {
          return context.report({
            messageId: "addItemIndexArgument",
            node,
          });
        }

        // @ts-ignore
        const [_first, _second, thirdArg] = node?.argument?.arguments;

        if (!thirdArg || !isObjectWithItemIndexKey(thirdArg)) {
          return context.report({
            messageId: "addItemIndexArgument",
            node,
          });
        }
      },
    };
  },
});

function isObjectWithItemIndexKey(node: TSESTree.ObjectExpression) {
  return (
    node.type === AST_NODE_TYPES.ObjectExpression &&
    node.properties.length === 1 &&
    node.properties[0] &&
    node.properties[0].type === AST_NODE_TYPES.Property &&
    node.properties[0].key.type === AST_NODE_TYPES.Identifier &&
    node.properties[0].key.name === "itemIndex"
  );
}
