import { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/utils";

import { identifiers as id } from "../identifiers";

import {
  restoreObject,
  restoreNodeParamOptions,
  restoreFixedCollectionValues,
} from "./_restore";

import type {
  BooleanProperty,
  NumberProperty,
  StringProperty,
} from "../../types";

export function getStringProperty(
  identifier: (
    property: TSESTree.ObjectLiteralElement
  ) => property is StringProperty,
  nodeParam: TSESTree.ObjectExpression
) {
  const found = nodeParam.properties.find(identifier);

  if (!found) return null;

  return {
    ast: found,
    value: found.value.value,
  };
}

export function getDisplayName(nodeParam: TSESTree.ObjectExpression) {
  return getStringProperty(id.nodeParam.isDisplayName, nodeParam);
}

export function getPlaceholder(nodeParam: TSESTree.ObjectExpression) {
  return getStringProperty(id.nodeParam.isPlaceholder, nodeParam);
}

export function getName(nodeParam: TSESTree.ObjectExpression) {
  return getStringProperty(id.nodeParam.isName, nodeParam);
}

export function getType(nodeParam: TSESTree.ObjectExpression) {
  return getStringProperty(id.nodeParam.isType, nodeParam);
}

function getBooleanProperty(
  identifier: (
    property: TSESTree.ObjectLiteralElement
  ) => property is BooleanProperty,
  nodeParam: TSESTree.ObjectExpression
) {
  const found = nodeParam.properties.find(identifier);

  if (!found) return null;

  return {
    ast: found,
    value: found.value.value,
  };
}

export function getNoDataExpression(nodeParam: TSESTree.ObjectExpression) {
  return getBooleanProperty(id.nodeParam.isNoDataExpression, nodeParam);
}

export function getRequired(nodeParam: TSESTree.ObjectExpression) {
  return getBooleanProperty(id.nodeParam.isRequired, nodeParam);
}

export function getNumberProperty(
  identifier: (
    property: TSESTree.ObjectLiteralElement
  ) => property is NumberProperty,
  nodeParam: TSESTree.ObjectExpression
) {
  const found = nodeParam.properties.find(identifier);

  if (!found) return null;

  return {
    ast: found,
    value: found.value.value,
  };
}

export function getTypeOptions(nodeParam: TSESTree.ObjectExpression) {
  const found = nodeParam.properties.find(id.nodeParam.isTypeOptions);

  if (!found) return null;

  return {
    ast: found,
    value: restoreObject(found.value),
  };
}

export function getOptions(nodeParam: TSESTree.ObjectExpression) {
  const found = nodeParam.properties.find(id.nodeParam.isOptions);

  if (!found) return null;

  if (!found.value.elements) {
    return {
      ast: found,
      value: [{ name: "", value: "" }],
      isPropertyPointingToVar: true,
    };
  }

  const elements = found.value.elements.filter(
    (i) => i.type === "ObjectExpression"
  );

  if (!elements.length) return null;

  return {
    ast: found,
    value: restoreNodeParamOptions(elements),
    isPropertyPointingToVar: false,
  };
}

export function getFixedCollectionValues(nodeParam: TSESTree.ObjectExpression) {
  const found = nodeParam.properties.find(id.nodeParam.isFixedCollectionValues);

  if (!found) return null;

  const elements = found.value.elements.filter(
    (i) => i.type === "ObjectExpression"
  );

  if (!elements.length) return null;

  return {
    ast: found,
    value: restoreFixedCollectionValues(elements),
  };
}

export function getMinValue(nodeParam: TSESTree.ObjectExpression) {
  const typeOptions = getTypeOptions(nodeParam);

  if (!typeOptions) return null;

  const { properties } = typeOptions.ast.value;

  const found = properties.find(id.nodeParam.isMinValue);

  if (!found) return null;

  return {
    ast: found,
    value: found.value.value,
  };
}

export function getLoadOptionsMethod(nodeParam: TSESTree.ObjectExpression) {
  const typeOptions = getTypeOptions(nodeParam);

  if (!typeOptions) return null;

  const { properties } = typeOptions.ast.value;

  const found = properties.find(id.nodeParam.isLoadOptionsMethod);

  if (!found) return null;

  return {
    ast: found,
    value: found.value.value,
  };
}

export function getDescription(nodeParam: TSESTree.ObjectExpression) {
  for (const property of nodeParam.properties) {
    if (id.nodeParam.isDescription(property)) {
      return {
        ast: property,
        value: property.value.value,
      };
    }

    if (id.nodeParam.isTemplateDescription(property)) {
      if (property.value.quasis.length > 1) {
        // template string literal divided by interpolations
        const consolidated = property.value.quasis
          .map((templateElement) => templateElement.value.cooked)
          .join();

        return {
          ast: property,
          value: consolidated,
          hasUnneededBackticks: false,
        };
      }

      const [templateElement] = property.value.quasis;
      const { value: content } = templateElement;

      const escapedRawContent = content.raw.replace(/\\/g, "");

      return {
        ast: property,
        value: content.raw,
        hasUnneededBackticks: escapedRawContent === content.cooked,
      };
    }
  }

  return null;
}

export function getDefault(nodeParam: TSESTree.ObjectExpression) {
  for (const property of nodeParam.properties) {
    if (
      property.type === AST_NODE_TYPES.Property &&
      property.key.type === AST_NODE_TYPES.Identifier &&
      property.key.name === "default" &&
      property.value.type === AST_NODE_TYPES.CallExpression
    ) {
      return {
        ast: property,
        hasCallExpression: true, // default: scopes.join(',')
      };
    }

    if (id.nodeParam.isTemplateLiteralDefault(property)) {
      const consolidated = property.value.quasis
        .map((templateElement) => templateElement.value.cooked)
        .join();

      return {
        ast: property,
        value: consolidated,
      };
    }

    if (id.nodeParam.isUnaryExpression(property)) {
      return {
        ast: property,
        value: parseInt(
          property.value.operator + property.value.argument.raw // e.g. -1
        ),
      };
    }

    if (id.nodeParam.isPrimitiveDefault(property)) {
      return {
        ast: property,
        value: property.value.value,
      };
    }

    if (id.nodeParam.isObjectDefault(property)) {
      return {
        ast: property,
        value: restoreObject(property.value),
      };
    }

    if (id.nodeParam.isArrayDefault(property)) {
      return {
        ast: property,
        value: property.value.elements,
      };
    }
  }

  return null;
}
