import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import * as utils from "../ast";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "In a credential class, the field `properties` must be typed 'INodeProperties' and individual properties must have no assertions.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      removeAssertionAndType:
        "Remove assertion and type field 'properties' with 'INodeProperties[]' [autofixable]",
      removeAssertion: "Remove assertion [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      TSAsExpression(node) {
        if (!utils.isCredentialFile(context.getFilename())) return;

        const assertionNodes = getAssertionNodes(node);

        if (assertionNodes) {
          const { insertionNode, removalNode, typingExists } = assertionNodes;

          const rangeToRemove = utils.getRangeOfAssertion(removalNode);

          if (typingExists) {
            return context.report({
              messageId: "removeAssertion",
              node,
              fix: (fixer) => fixer.removeRange(rangeToRemove),
            });
          }

          context.report({
            messageId: "removeAssertionAndType",
            node,
            fix: (fixer) => {
              // double fix
              return [
                fixer.removeRange(rangeToRemove),
                fixer.insertTextAfterRange(
                  insertionNode.range,
                  ": INodeProperties[]"
                ),
              ];
            },
          });
        }
      },
    };
  },
});

function getAssertionNodes(node: TSESTree.TSAsExpression) {
  if (
    node.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference &&
    node.typeAnnotation.typeName.type === AST_NODE_TYPES.Identifier &&
    node.typeAnnotation.typeName.name === "NodePropertyTypes" &&
    node.parent?.type === AST_NODE_TYPES.Property &&
    node.parent.key.type === AST_NODE_TYPES.Identifier &&
    node.parent.key.name === "type"
  ) {
    const insertionNode = node.parent?.parent?.parent?.parent;

    if (!insertionNode) return null;

    if (
      insertionNode.type === AST_NODE_TYPES.PropertyDefinition &&
      insertionNode.computed === false &&
      insertionNode.key.type === AST_NODE_TYPES.Identifier &&
      insertionNode.key.name === "properties"
    ) {
      return {
        removalNode: node.typeAnnotation.typeName,
        insertionNode: insertionNode.key,
        typingExists: isAlreadyTyped(insertionNode),
      };
    }
  }

  return null;
}

function isAlreadyTyped(node: TSESTree.PropertyDefinitionNonComputedName) {
  if (!node.typeAnnotation) return false;

  return (
    node.typeAnnotation.type === AST_NODE_TYPES.TSTypeAnnotation &&
    node.typeAnnotation.typeAnnotation.type === AST_NODE_TYPES.TSArrayType &&
    node.typeAnnotation.typeAnnotation.elementType.type ===
      AST_NODE_TYPES.TSTypeReference &&
    node.typeAnnotation.typeAnnotation.elementType.typeName.type ===
      AST_NODE_TYPES.Identifier &&
    node.typeAnnotation.typeAnnotation.elementType.typeName.name ===
      "INodeProperties"
  );
}
