import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { utils } from "../ast/utils";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "The `execute()` method in a node must implement `continueOnFail` in a try-catch block.",
      recommended: "error",
    },
    schema: [],
    messages: {
      addContinueOnFail: "Implement 'continueOnFail' [non-autofixable]", // unknowable implementation
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      MethodDefinition(node) {
        if (!utils.isNodeFile(context.getFilename())) return;

        const executeForLoop = getExecuteForLoop(node);

        if (!executeForLoop) return;

        const hasContinueOnFail = executeForLoop.body.some((e) => {
          const tryCatch = getTryCatch(e);

          if (!tryCatch) return;

          return tryCatch.body.some(isContinueOnFail);
        });

        if (!hasContinueOnFail) {
          context.report({
            messageId: "addContinueOnFail",
            node,
          });
        }
      },
    };
  },
});

function getExecuteForLoop(node: TSESTree.MethodDefinition) {
  if (
    node.key.type === AST_NODE_TYPES.Identifier &&
    node.key.name === "execute" &&
    node.value.type === AST_NODE_TYPES.FunctionExpression &&
    node.value.body.type === AST_NODE_TYPES.BlockStatement &&
    node.value.body.body.length === 1 &&
    node.value.body.body[0].type === AST_NODE_TYPES.ForStatement &&
    node.value.body.body[0].body.type === AST_NODE_TYPES.BlockStatement
  ) {
    return node.value.body.body[0].body;
  }

  return null;
}

/**
 * IMPORTANT! Do _not_ use the string `ock` in a typed function name, e.g. `getTryCatchBlock`.
 * `esbuild-jest` fails to transpile when searching for `ock` (`jest.mock`) in typed functions.
 *
 * https://github.com/aelbore/esbuild-jest/issues/57
 * https://github.com/aelbore/esbuild-jest/blob/master/src/index.ts#L33-L40
 */
function getTryCatch(node: TSESTree.Statement) {
  if (
    node.type === AST_NODE_TYPES.TryStatement &&
    node.handler !== null &&
    node.handler.body.type === AST_NODE_TYPES.BlockStatement
  ) {
    return node.handler.body;
  }

  return null;
}

function isContinueOnFail(node: TSESTree.Statement) {
  return (
    node.type === AST_NODE_TYPES.IfStatement &&
    node.test.type === AST_NODE_TYPES.CallExpression &&
    node.test.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.test.callee.object.type === AST_NODE_TYPES.ThisExpression &&
    node.test.callee.property.type === AST_NODE_TYPES.Identifier &&
    node.test.callee.property.name === "continueOnFail"
  );
}
