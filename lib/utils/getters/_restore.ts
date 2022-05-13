import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

/**
 * Restore the source value of an array of primitives,
 * e.g. `inputs` and `outputs` in a node class description.
 */
export function restoreArray(elements: TSESTree.Expression[]) {
  return elements.reduce<string[]>((acc, e) => {
    if (e.type === AST_NODE_TYPES.Literal && e.value) {
      acc.push(e.value.toString());
    }

    return acc;
  }, []);
}

/**
 * Restore the source value of an array of objects,
 * e.g. `options` in a node param.
 */
export function restoreObjectArray(elements: TSESTree.ObjectExpression[]) {
  return elements.reduce<Array<Record<string, unknown>>>((acc, e) => {
    if (e.type === AST_NODE_TYPES.ObjectExpression) {
      acc.push(restoreObject(e));
    }

    return acc;
  }, []);
}

/**
 * Restore the source value of an object,
 * e.g. `typeOptions` in a node param.
 */
export function restoreObject(objectExpression: TSESTree.ObjectExpression) {
  return objectExpression.properties.reduce<Record<string, unknown>>(
    (acc, property) => {
      if (isArrayExpression(property)) {
        acc[property.key.name] = restoreObjectArray(property.value.elements); // e.g. options: [...]
      } else if (isLiteral(property)) {
        acc[property.key.name] = property.value.value;
      } else if (isUnaryExpression(property)) {
        acc[property.key.name] = parseInt(
          property.value.operator + property.value.argument.raw // e.g. -1
        );
      }
      return acc;
    },
    {}
  );
}

/**
 * Restore the source value of an array of node parameters under `values`
 * in a fixed collection section.
 */
export function restoreFixedCollectionValues(
  options: TSESTree.ObjectExpression[]
) {
  const isNodeParameterAsValue = (entity: {
    displayName?: string;
  }): entity is { displayName: string } => entity.displayName !== undefined;

  const restoredValues: { displayName: string }[] = [];

  for (const option of options) {
    const restoredValue = restoreObject(option);

    if (!isNodeParameterAsValue(restoredValue)) continue;

    restoredValues.push(restoredValue);
  }

  return restoredValues;
}

/**
 * Restore the source value of an array of `options` in an options-type or
 * multi-options-type node param.
 */
export function restoreNodeParamOptions(options: TSESTree.ObjectExpression[]) {
  const isOption = (entity: {
    name?: string;
    value?: string;
  }): entity is { name: string; value: string } =>
    entity.name !== undefined && entity.value !== undefined;

  const restoredOptions: { name: string; value: string }[] = [];

  for (const option of options) {
    const restoredOption = restoreObject(option);

    if (!isOption(restoredOption)) continue;

    restoredOptions.push(restoredOption);
  }

  return restoredOptions;
}

/**
 * Restore the source value of an array of `options` under `credentials`
 * in a node class description.
 */
export function restoreClassDescriptionOptions(
  credOptions: TSESTree.ObjectExpression[]
) {
  const isCredOption = (entity: {
    name?: string;
  }): entity is { name: string } => entity.name !== undefined;

  const restoredCredOptions: { name: string; required?: true }[] = [];

  for (const credOption of credOptions) {
    const restoredCredOption = restoreObject(credOption);

    if (!isCredOption(restoredCredOption)) continue;

    restoredCredOptions.push(restoredCredOption);
  }

  return restoredCredOptions;
}

const isLiteral = (
  property: TSESTree.ObjectLiteralElement
): property is TSESTree.PropertyNonComputedName & {
  key: { name: string };
  value: { value: string };
} => {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    property.value.type === AST_NODE_TYPES.Literal
  );
};

const isUnaryExpression = (
  property: TSESTree.ObjectLiteralElement
): property is TSESTree.PropertyNonComputedName & {
  key: { name: string };
  value: { operator: string; argument: { raw: string } };
} => {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    property.value.type === AST_NODE_TYPES.UnaryExpression
  );
};

const isArrayExpression = (
  property: TSESTree.ObjectLiteralElement
): property is TSESTree.PropertyNonComputedName & {
  key: { name: string };
  value: { elements: TSESTree.ObjectExpression[] }; // @TODO: Double-check type
} => {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    typeof property.key.name === "string" &&
    property.value.type === AST_NODE_TYPES.ArrayExpression
  );
};
