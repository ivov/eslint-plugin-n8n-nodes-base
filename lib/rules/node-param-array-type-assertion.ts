import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "Array of node parameters must be typed, not type-asserted.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      typeArray: "Use ': INodeProperties[]' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TSAsExpression(node) {
        if (containsArrayOfNodeParams(node)) {
          if (
            node.parent?.type !== AST_NODE_TYPES.VariableDeclarator ||
            node.parent?.id.type !== AST_NODE_TYPES.Identifier
          ) {
            return;
          }

          const rangeToRemove = utils.getRangeToRemove({
            ast: node.typeAnnotation,
          });

          const { range } = node.parent.id;

          if (!range) return null;

          const indentation = getTrailingBracketIndentation(node);

          context.report({
            messageId: "typeArray",
            node,
            fix: (fixer) => {
              // double fix
              return [
                fixer.replaceTextRange(rangeToRemove, indentation),
                fixer.insertTextAfterRange(range, ": INodeProperties[]"),
              ];
            },
          });
        }
      },
    };
  },
});

function containsArrayOfNodeParams(node: TSESTree.TSAsExpression) {
  if (
    node.expression.type !== AST_NODE_TYPES.ArrayExpression ||
    node.expression.elements.length === 0
  ) {
    return false;
  }

  return node.expression.elements.every((element) => {
    return (
      element.type === AST_NODE_TYPES.ObjectExpression &&
      id.isNodeParameter(element)
    );
  });
}

function getTrailingBracketIndentation(node: TSESTree.TSAsExpression) {
  return "\t".repeat(node.expression.loc.end.column - 1); // `- 1` to remove bracket column
}
