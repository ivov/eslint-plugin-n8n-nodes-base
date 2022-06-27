import { TSESTree } from "@typescript-eslint/utils";

import {
  isArrayPropertyNamed,
  isNumericPropertyNamed,
  isStringPropertyNamed,
} from "./common.identifiers";

import type {
  ArrayProperty,
  OptionsProperty,
  NumberProperty,
  StringProperty,
} from "../../types";

/**
 * Module to identify properties in a node class `description`.
 *
 * ```ts
 * export class MyService implements INodeType {
    description: INodeTypeDescription = {
      displayName: 'My Service',
      name: 'myService', // ← isName()
      icon: 'file:myService.svg', // ← isIcon()
      group: ['transform'],
      version: 1, // ← isVersion()
      subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}', // ← isSubtitle()
      description: 'Consume My Service API',
      defaults: {
        name: 'My Service',
      },
      inputs: ['main'], // ← isInputs()
      outputs: ['main'], // ← isOutputs()
      credentials: [ // ← isCredentials()
        {
          name: 'myServiceApi',
          required: true,
          testedBy: 'myServiceApiTest',
        },
      ],
      properties: [...] // ← isProperties()
      ~snip~
 * ```
 */

export function isName(
  property: TSESTree.ObjectLiteralElement
): property is StringProperty {
  return isStringPropertyNamed("name", property);
}

export function isIcon(
  property: TSESTree.ObjectLiteralElement
): property is StringProperty {
  return isStringPropertyNamed("icon", property);
}

export function isVersion(
  property: TSESTree.ObjectLiteralElement
): property is NumberProperty {
  return isNumericPropertyNamed("version", property);
}

export function isSubtitle(
  property: TSESTree.ObjectLiteralElement
): property is StringProperty {
  return isStringPropertyNamed("subtitle", property);
}

export function isDefaultVersion(
  property: TSESTree.ObjectLiteralElement
): property is NumberProperty {
  return isNumericPropertyNamed("defaultVersion", property);
}

export function isInputs(
  property: TSESTree.ObjectLiteralElement
): property is ArrayProperty {
  return isArrayPropertyNamed("inputs", property);
}

export function isOutputs(
  property: TSESTree.ObjectLiteralElement
): property is ArrayProperty {
  return isArrayPropertyNamed("outputs", property);
}

export function isCredentials(
  property: TSESTree.ObjectLiteralElement
): property is OptionsProperty {
  return isArrayPropertyNamed("credentials", property);
}

export function isProperties(
  property: TSESTree.ObjectLiteralElement
): property is TSESTree.PropertyNonComputedName & {
  value: { elements: TSESTree.ObjectExpression[] };
} {
  return isArrayPropertyNamed("properties", property);
}
