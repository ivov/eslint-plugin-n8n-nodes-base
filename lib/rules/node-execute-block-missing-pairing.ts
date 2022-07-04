import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { utils } from "../ast/utils";
import { assert } from "console";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "Every operation in the `execute()` method in a node must implement pairing.",
      recommended: "error",
    },
    schema: [],
    messages: {
      implementPairing: "Implement pairing [non-autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      MethodDefinition(node) {
        if (!utils.isNodeFile(context.getFilename())) return;

        const executeMethod = getExecuteMethod(node);

        if (!executeMethod) return;

        const inputItemsArrayName = getInputItemsArrayName(executeMethod); // TODO: Use in check
        const returnDataArrayName = getReturnDataArrayName(executeMethod); // TODO: Use in check

        if (!inputItemsArrayName) return;
        if (!returnDataArrayName) return;

        const forLoop = executeMethod.body.find(isForLoop);

        if (!forLoop) return;

        const inputItemsIndexName = getInputItemsIndexName(forLoop); // TODO: Use in check

        if (!inputItemsIndexName) return;

        const tryCatch = forLoop.body.body.find(isTryCatch);

        if (!tryCatch) return;

        const resourcesRoot = tryCatch.block.body.find(isResourceChecksRoot);

        if (!resourcesRoot) return;

        const resourceConsequents = collectConsequents(resourcesRoot);

        const allOperationConsequents = resourceConsequents.reduce<
          TSESTree.BlockStatement[]
        >((acc, resourceConsequent) => {
          assertSingleConditionalChain(resourceConsequent);

          const [operationsRoot] = resourceConsequent.body;
          const operationConsequents = collectConsequents(operationsRoot);

          return [...acc, ...operationConsequents];
        }, []);

        // main repo node -> check only getAll
        // community package node -> check all operations
        const isMainRepoNode = context.getFilename().includes("packages/nodes");

        // TODO: temp for one, pending loop over all operations
        const consequent = allOperationConsequents[0];

        const lastStatement = consequent.body[consequent.body.length - 1];

        // last statement is not `returnData.push({ ... })`
        if (
          lastStatement.type !== AST_NODE_TYPES.ExpressionStatement ||
          !isReturnDataPush(lastStatement) ||
          !hasSingleArgument(lastStatement)
        ) {
          return context.report({
            messageId: "implementPairing",
            node: consequent,
          });
        }

        const [argument] = lastStatement.expression.arguments;

        isValidReturnDataPushArgument(argument);
      },
    };
  },
});

// ----------------------------------
//            identifiers
// ----------------------------------

const isForLoop = (
  node: TSESTree.Node
): node is TSESTree.ForStatement & {
  body: TSESTree.BlockStatement;
} => node.type === AST_NODE_TYPES.ForStatement;

const isTryCatch = (node: TSESTree.Node): node is TSESTree.TryStatement =>
  node.type === AST_NODE_TYPES.TryStatement;

const isReturnDataPush = (
  node: TSESTree.ExpressionStatement
): node is TSESTree.ExpressionStatement & {
  expression: { type: AST_NODE_TYPES.CallExpression };
} => {
  return (
    node.expression.type === AST_NODE_TYPES.CallExpression &&
    node.expression.callee.type === AST_NODE_TYPES.MemberExpression &&
    node.expression.callee.object.type === AST_NODE_TYPES.Identifier &&
    node.expression.callee.object.name === "returnData" &&
    node.expression.callee.property.type === AST_NODE_TYPES.Identifier &&
    node.expression.callee.property.name === "push"
  );
};

const hasSingleArgument = (
  statement: TSESTree.ExpressionStatement & {
    expression: { type: AST_NODE_TYPES.CallExpression };
  }
) => statement.expression.arguments.length === 1;

const isResourceChecksRoot = (
  node: TSESTree.Node
): node is TSESTree.IfStatement =>
  node.type === AST_NODE_TYPES.IfStatement &&
  node.test.type === AST_NODE_TYPES.BinaryExpression &&
  node.test.operator === "===" &&
  node.test.left.type === AST_NODE_TYPES.Identifier &&
  node.test.left.name === "resource";

// ----------------------------------
//             getters
// ----------------------------------

/**
 * Get the content of then `execute()` method.
 * 
 * ```ts
 * async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> { _ }
 * ```
 */
function getExecuteMethod(node: TSESTree.MethodDefinition) {
  if (
    node.key.type === AST_NODE_TYPES.Identifier &&
    node.key.name === "execute" &&
    node.value.type === AST_NODE_TYPES.FunctionExpression &&
    node.value.body.type === AST_NODE_TYPES.BlockStatement
  ) {
    return node.value.body;
  }
}

/**
 * Get the name of the `items` AST.
 *
 * ```ts
 * for (let _ = 0; _ < items.length; _++) {
 * ```
 */
function getInputItemsIndexName(
  forLoop: TSESTree.ForStatement & {
    body: TSESTree.BlockStatement;
  }
) {
  if (
    forLoop.init !== null &&
    forLoop.init.type === AST_NODE_TYPES.VariableDeclaration &&
    forLoop.init.declarations.length > 0 &&
    forLoop.init.declarations[0].type === AST_NODE_TYPES.VariableDeclarator &&
    forLoop.init.declarations[0].id.type === AST_NODE_TYPES.Identifier
  ) {
    return forLoop.init.declarations[0].id.name;
  }

  return null;
}

/**
 * Get the name of the `items` AST.
 *
 * ```ts
 * const _ = this.getInputData();
 * ```
 */
function getInputItemsArrayName(executeMethod: TSESTree.BlockStatement) {
  for (const node of executeMethod.body) {
    if (
      node.type === AST_NODE_TYPES.VariableDeclaration &&
      node.declarations.length === 1 &&
      node.declarations[0].id.type === AST_NODE_TYPES.Identifier &&
      node.declarations[0].init !== null &&
      node.declarations[0].init.type === AST_NODE_TYPES.CallExpression &&
      node.declarations[0].init.callee.type ===
        AST_NODE_TYPES.MemberExpression &&
      node.declarations[0].init.callee.property.type ===
        AST_NODE_TYPES.Identifier &&
      node.declarations[0].init.callee.property.name === "getInputData"
    )
      return node.declarations[0].id.name;
  }

  return null;
}

/**
 * Get the name of the `returnData` AST.
 *
 * ```ts
 * const _: IDataObject[] = [];
 * ```
 */
function getReturnDataArrayName(executeMethod: TSESTree.BlockStatement) {
  for (const node of executeMethod.body) {
    if (
      node.type === AST_NODE_TYPES.VariableDeclaration &&
      node.declarations.length === 1 &&
      node.declarations[0].id.type === AST_NODE_TYPES.Identifier &&
      node.declarations[0].init !== null &&
      node.declarations[0].init.type === AST_NODE_TYPES.ArrayExpression &&
      node.declarations[0].init.elements.length === 0 &&
      node.declarations[0].id.typeAnnotation !== undefined &&
      node.declarations[0].id.typeAnnotation.typeAnnotation.type ===
        AST_NODE_TYPES.TSArrayType &&
      node.declarations[0].id.typeAnnotation.typeAnnotation.elementType.type ===
        AST_NODE_TYPES.TSTypeReference &&
      node.declarations[0].id.typeAnnotation.typeAnnotation.elementType.typeName
        .type === AST_NODE_TYPES.Identifier &&
      node.declarations[0].id.typeAnnotation.typeAnnotation.elementType.typeName
        .name === "IDataObject"
    ) {
      return node.declarations[0].id.name;
    }
  }

  return null;
}

// ----------------------------------
//              utils
// ----------------------------------

function collectConsequents(
  node: TSESTree.Node,
  collection: TSESTree.BlockStatement[] = []
) {
  if (
    node.type === AST_NODE_TYPES.IfStatement &&
    node.consequent.type === AST_NODE_TYPES.BlockStatement
  ) {
    collection.push(node.consequent);
  }

  if (
    node.type === AST_NODE_TYPES.IfStatement &&
    node.alternate !== null &&
    node.alternate.type === AST_NODE_TYPES.IfStatement
  ) {
    collectConsequents(node.alternate, collection);
  }

  return collection;
}

/**
 * A conditional chain `if → else if → else` is reflected as
 * an AST node with a consequent and increasingly nested alternates.
 * Operation blocks are expected to contain a **single** conditional chain
 * of indefinitely nested alternates.
 */
function assertSingleConditionalChain(
  resourceConsequent: TSESTree.BlockStatement
) {
  assert(
    resourceConsequent.body.length === 1,
    [
      "Assertion failed: Found a resource consequent with more than one if-statement",
      JSON.stringify(resourceConsequent.loc),
    ].join("\n")
  );
}

/**
 * Check if the argument to `returnData.push` has the expected shape.
 * 
 * ```ts
 * returnData.push(_);
 * ```
 */
function isValidReturnDataPushArgument(arg: TSESTree.CallExpressionArgument) {
  if (arg.type !== AST_NODE_TYPES.ObjectExpression) return false;

  const hasJsonKey = arg.properties.some(
    (property) =>
      property.type === AST_NODE_TYPES.Property &&
      property.key.type === AST_NODE_TYPES.Identifier &&
      property.key.name === "json"
  );

  const hasPairedItemKey = arg.properties.some(
    (property) =>
      property.type === AST_NODE_TYPES.Property &&
      property.key.type === AST_NODE_TYPES.Identifier &&
      property.key.name === "pairedItem"
  );

  // TODO: Check value of `json` key?
  // TODO: Check value of `pairedItem` key?

  return hasJsonKey && hasPairedItemKey;
}
