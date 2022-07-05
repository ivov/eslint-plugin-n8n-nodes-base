import { assert } from "console";
import { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { id } from "../identifiers";

export function getOperationConsequents(
  node: TSESTree.MethodDefinition,
  { type }: { type: "singular" | "plural" } // filter getAll or non-getAll
) {
  const executeMethod = getExecuteMethod(node);

  if (!executeMethod) return;

  const returnDataArrayName = getReturnDataArrayName(executeMethod);

  if (!returnDataArrayName) return;

  const forLoop = executeMethod.body.find(id.nodeExecuteBlock.isForLoop);

  if (!forLoop) return;

  const inputItemsIndexName = getInputItemsIndexName(forLoop);

  if (!inputItemsIndexName) return;

  const tryCatch = forLoop.body.body.find(id.nodeExecuteBlock.isTryCatch);

  if (!tryCatch) return;

  const resourcesRoot = tryCatch.block.body.find(
    id.nodeExecuteBlock.isResourceChecksRoot
  );

  if (!resourcesRoot) return;

  const operationConsequents = collectConsequents(resourcesRoot).reduce<
    TSESTree.BlockStatement[]
  >((acc, resourceConsequent) => {
    assertSingleConditionalChain(resourceConsequent);

    const [operationsRoot] = resourceConsequent.body;
    const opConsequentsPerResource = collectConsequents(operationsRoot).filter(
      (consequent) =>
        type === "plural" ? isGetAll(consequent) : !isGetAll(consequent)
    );

    return [...acc, ...opConsequentsPerResource];
  }, []);

  return {
    operationConsequents,
    inputItemsIndexName,
    returnDataArrayName,
  };
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
 * Collect all the recursively nested consequents of if statements into an array.
 */
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
 * Get the value of the `pairedItem` key in the argument to `returnData.push()`
 *
 * ```ts
 * pairedItem: { ... }
 *             ^-----^
 * ```
 */
export function getPairedItemValue(
  properties: TSESTree.ObjectLiteralElement[]
) {
  const found = properties.find(
    (
      property
    ): property is TSESTree.ObjectLiteralElement & {
      value: {
        type: AST_NODE_TYPES.ObjectExpression;
        properties: TSESTree.Property[];
      };
    } =>
      property.type === AST_NODE_TYPES.Property &&
      property.value.type === AST_NODE_TYPES.ObjectExpression
  );

  return found ? found.value : null;
}

/**
 * Get the AST node where the pairing rule will be flagged.
 */
export function getMarkedNodeFromConsequent(
  consequent: TSESTree.BlockStatement
) {
  if (
    consequent.parent?.type === AST_NODE_TYPES.IfStatement &&
    consequent.parent?.test.type === AST_NODE_TYPES.BinaryExpression &&
    consequent.parent?.test.operator === "===" &&
    consequent.parent?.test.left.type === AST_NODE_TYPES.Identifier &&
    consequent.parent?.test.left.name === "operation"
  ) {
    return consequent.parent?.test.right;
  }
}

function isGetAll(consequent: TSESTree.BlockStatement) {
  return (
    consequent.parent !== undefined &&
    consequent.parent.type === AST_NODE_TYPES.IfStatement &&
    consequent.parent.test.type === AST_NODE_TYPES.BinaryExpression &&
    consequent.parent.test.operator === "===" &&
    consequent.parent.test.left.type === AST_NODE_TYPES.Identifier &&
    consequent.parent.test.left.name === "operation" &&
    consequent.parent.test.right.type === AST_NODE_TYPES.Literal &&
    consequent.parent.test.right.value === "getAll"
  );
}
