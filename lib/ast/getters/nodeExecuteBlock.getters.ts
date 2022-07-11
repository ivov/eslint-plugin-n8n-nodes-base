import { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { id } from "../identifiers";

export function getOperationConsequents(
  node: TSESTree.MethodDefinition,
  { filter }: { filter: "singular" | "plural" | "all" } // filter getAll or non-getAll or do not filter
) {
  const executeMethod = getExecuteContent(node);

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
    // TODO: Handle resource consequent with more than one `IfStatement`
    if (resourceConsequent.body.length !== 1) return acc;

    const [operationsRoot] = resourceConsequent.body;

    const opConsequentsPerResource =
      filter === "all"
        ? collectConsequents(operationsRoot)
        : collectConsequents(operationsRoot).filter((consequent) =>
            filter === "plural" ? isGetAll(consequent) : !isGetAll(consequent)
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
 * Get the block (i.e., content) of the `execute()` method.
 *
 * ```ts
 * async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> { _ }
 * ```
 *
 * IMPORTANT! Do _not_ use the string `ock` in a typed function name, e.g. `getExecuteBlock`.
 * `esbuild-jest` fails to transpile when searching for `ock` (`jest.mock`) in typed functions.
 *
 * https://github.com/aelbore/esbuild-jest/issues/57
 * https://github.com/aelbore/esbuild-jest/blob/master/src/index.ts#L33-L40
 */
export function getExecuteContent({ key, value }: TSESTree.MethodDefinition) {
  if (
    key.type === AST_NODE_TYPES.Identifier &&
    key.name === "execute" &&
    value.type === AST_NODE_TYPES.FunctionExpression &&
    value.body.type === AST_NODE_TYPES.BlockStatement
  ) {
    return value.body;
  }
}

/**
 * Get the name of the `returnData` AST.
 *
 * ```ts
 * const _: IDataObject[] = [];
 * const _: INodeExecutionData[] = [];
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
      ["IDataObject", "INodeExecutionData"].includes(
        node.declarations[0].id.typeAnnotation.typeAnnotation.elementType
          .typeName.name
      )
    ) {
      return node.declarations[0].id.name;
    }
  }

  return null;
}

/**
 * Get the name of the index used to iterate through the input items.
 *
 * ```ts
 * for (let _ = 0; _ < items.length; _++) {
 * ```
 */
export function getInputItemsIndexName(
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
 * Recursively collect every alternate and consequent in an `IfStatement` and its children.
 */
export function collectConsequents(
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
