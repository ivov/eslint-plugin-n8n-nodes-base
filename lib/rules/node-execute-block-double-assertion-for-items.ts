import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { utils } from "../ast/utils";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "In the `execute()` method there is no need to double assert the type of `items.length`.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      removeDoubleAssertion: "Remove double assertion [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      MethodDefinition(node) {
        if (!utils.isNodeFile(context.getFilename())) return;

        const executeMethod = getExecuteMethod(node);

        if (!executeMethod) return;

        const declarationInit = getDoublyAssertedDeclarationInit(executeMethod);

        if (declarationInit) {
          context.report({
            messageId: "removeDoubleAssertion",
            node: declarationInit,
            fix: (fixer) => fixer.replaceText(declarationInit, "items.length"),
          });
        }
      },
    };
  },
});

function getExecuteMethod(node: TSESTree.MethodDefinition) {
  if (
    node.key.type === AST_NODE_TYPES.Identifier &&
    node.key.name === "execute" &&
    node.value.type === AST_NODE_TYPES.FunctionExpression &&
    node.value.body.type === AST_NODE_TYPES.BlockStatement
  ) {
    return node.value.body;
  }

  return null;
}

function getDoublyAssertedDeclarationInit(executeMethod: TSESTree.BlockStatement) {
  for (const node of executeMethod.body) {
    if (node.type === AST_NODE_TYPES.VariableDeclaration) {
      for (const declaration of node.declarations) {
        if (!declaration.init) continue;
        if (
          declaration.init.type === AST_NODE_TYPES.TSAsExpression &&
          declaration.init.typeAnnotation.type ===
            AST_NODE_TYPES.TSNumberKeyword &&
          declaration.init.expression.type === AST_NODE_TYPES.TSAsExpression &&
          declaration.init.expression.typeAnnotation.type ===
            AST_NODE_TYPES.TSUnknownKeyword &&
          declaration.init.expression.expression.type ===
            AST_NODE_TYPES.MemberExpression &&
          declaration.init.expression.expression.object.type ===
            AST_NODE_TYPES.Identifier &&
          declaration.init.expression.expression.object.name === "items" &&
          declaration.init.expression.expression.property.type ===
            AST_NODE_TYPES.Identifier &&
          declaration.init.expression.expression.property.name === "length"
        ) {
          return declaration.init;
        }
      }
    }
  }

  return null;
}
