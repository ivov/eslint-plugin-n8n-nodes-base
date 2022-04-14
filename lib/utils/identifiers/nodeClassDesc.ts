import { TSESTree } from "@typescript-eslint/utils";

import {
  isArrayPropertyWithKey,
  isNumericPropertyWithKey,
  isStringPropertyWithKey,
} from "./_typedProps";

import type {
  ArrayProperty,
  OptionsProperty,
  NumberProperty,
  StringProperty,
} from "../../types";

/**
 * Module to identify properties in a node class description.
 */

export function isVersion(
  property: TSESTree.ObjectLiteralElement
): property is NumberProperty {
  return isNumericPropertyWithKey("version", property);
}

export function isDefaultVersion(
  property: TSESTree.ObjectLiteralElement
): property is NumberProperty {
  return isNumericPropertyWithKey("defaultVersion", property);
}

export function isIcon(
  property: TSESTree.ObjectLiteralElement
): property is StringProperty {
  return isStringPropertyWithKey("icon", property);
}

export function isSubtitle(
  property: TSESTree.ObjectLiteralElement
): property is StringProperty {
  return isStringPropertyWithKey("subtitle", property);
}

export function isInputs(
  property: TSESTree.ObjectLiteralElement
): property is ArrayProperty {
  return isArrayPropertyWithKey("inputs", property);
}

export function isOutputs(
  property: TSESTree.ObjectLiteralElement
): property is ArrayProperty {
  return isArrayPropertyWithKey("outputs", property);
}

export function isCredentials(
  property: TSESTree.ObjectLiteralElement
): property is OptionsProperty {
  return isArrayPropertyWithKey("credentials", property);
}

export function isName(
  property: TSESTree.ObjectLiteralElement
): property is StringProperty {
  return isStringPropertyWithKey("name", property);
}

export function isProperties(
  property: TSESTree.ObjectLiteralElement
): property is TSESTree.PropertyNonComputedName & {
  value: { elements: TSESTree.ObjectExpression[] };
} {
  return isArrayPropertyWithKey("properties", property);
}
