import * as utils from "../ast";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "The `execute()` method in a node may only throw `NodeApiError` for failed network requests and `NodeOperationError` for internal errors, not the built-in `Error`.",
      recommended: "error",
    },
    schema: [],
    messages: {
      useProperError:
        "Use `NodeApiError` or `NodeOperationError` [non-autofixable]", // complex inferral
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ThrowStatement(node) {
        if (!utils.isNodeFile(context.getFilename())) return;

        // `ThrowStatement` should be narrowed down into `NewExpression`
        // but `ThrowStatement.argument` is `Statement | TSAsExpression | null`
        // and `Statement` is `ThrowStatement | IfStatement | (many others)`

        // @ts-ignore
        const errorKind: string | undefined = node?.argument?.callee?.name;

        if (
          errorKind &&
          !["NodeApiError", "NodeOperationError"].includes(errorKind)
        ) {
          context.report({
            messageId: "useProperError",
            node,
          });
        }
      },
    };
  },
});
