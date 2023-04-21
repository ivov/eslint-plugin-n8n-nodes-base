import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

import type {
	ArrayProperty,
	BooleanProperty,
	OptionsProperty,
	NumberProperty,
	ObjectProperty,
	StringProperty,
	TemplateStringProperty,
	ValuesProperty,
} from "../../types";

import {
	isArrayPropertyNamed,
	isBooleanPropertyNamed,
	isObjectPropertyNamed,
	isIdentifierPropertyNamed,
	isStringPropertyNamed,
} from "./common.identifiers";

/**
 * Module to identify node param type, node param properties, etc.
 */

type NodeParamType =
	| "string"
	| "number"
	| "boolean"
	| "options"
	| "multiOptions"
	| "collection"
	| "fixedCollection"
	| "color";

function isParamOfType(
	type: NodeParamType,
	nodeParam: TSESTree.ObjectExpression
) {
	const found = nodeParam.properties.find((property) => {
		return (
			property.type === AST_NODE_TYPES.Property &&
			property.computed === false &&
			property.key.type === AST_NODE_TYPES.Identifier &&
			property.key.name === "type" &&
			property.value.type === AST_NODE_TYPES.Literal &&
			property.value.value === type
		);
	});

	return Boolean(found);
}

export function isStringType(nodeParam: TSESTree.ObjectExpression) {
	return isParamOfType("string", nodeParam);
}

export function isNumericType(nodeParam: TSESTree.ObjectExpression) {
	return isParamOfType("number", nodeParam);
}

export function isBooleanType(nodeParam: TSESTree.ObjectExpression) {
	return isParamOfType("boolean", nodeParam);
}

export function isOptionsType(nodeParam: TSESTree.ObjectExpression) {
	return isParamOfType("options", nodeParam);
}

export function isMultiOptionsType(nodeParam: TSESTree.ObjectExpression) {
	return isParamOfType("multiOptions", nodeParam);
}

export function isCollectionType(nodeParam: TSESTree.ObjectExpression) {
	return isParamOfType("collection", nodeParam);
}

export function isFixedCollectionType(nodeParam: TSESTree.ObjectExpression) {
	return isParamOfType("fixedCollection", nodeParam);
}

// named node parameter identifiers

export function hasName(
	name:
		| "simple"
		| "returnAll"
		| "limit"
		| "update"
		| "resource"
		| "operation"
		| "allowUnauthorizedCerts"
		| "email"
		| "action",
	nodeParam: TSESTree.ObjectExpression
) {
	let check = (value: string) => value === name;

	if (name === "update") check = (value: string) => /update/.test(value);

	for (const property of nodeParam.properties) {
		if (
			property.type === AST_NODE_TYPES.Property &&
			property.key.type === AST_NODE_TYPES.Identifier &&
			property.key.name === "name" &&
			property.value.type === AST_NODE_TYPES.Literal &&
			typeof property.value.value === "string" &&
			check(property.value.value)
		) {
			return true;
		}
	}

	return false;
}

export function isEmail(nodeParam: TSESTree.ObjectExpression) {
	return isStringType(nodeParam) && hasName("email", nodeParam);
}

export function isSimplify(nodeParam: TSESTree.ObjectExpression) {
	return isBooleanType(nodeParam) && hasName("simple", nodeParam);
}

export function isLimit(nodeParam: TSESTree.ObjectExpression) {
	return isNumericType(nodeParam) && hasName("limit", nodeParam);
}

export function isReturnAll(nodeParam: TSESTree.ObjectExpression) {
	return isBooleanType(nodeParam) && hasName("returnAll", nodeParam);
}

export function isIgnoreSslIssues(nodeParam: TSESTree.ObjectExpression) {
	return (
		isBooleanType(nodeParam) && hasName("allowUnauthorizedCerts", nodeParam)
	);
}

export function isUpdateFields(nodeParam: TSESTree.ObjectExpression) {
	return isCollectionType(nodeParam) && hasName("update", nodeParam);
}

export function isResource(nodeParam: TSESTree.ObjectExpression) {
	return isOptionsType(nodeParam) && hasName("resource", nodeParam);
}

export function isOperation(nodeParam: TSESTree.ObjectExpression) {
	return isOptionsType(nodeParam) && hasName("operation", nodeParam);
}

export function isAction(nodeParam: TSESTree.ObjectExpression) {
	return isOptionsType(nodeParam) && hasName("action", nodeParam);
}

export function isRequired(
	property: TSESTree.ObjectLiteralElement
): property is BooleanProperty {
	return isBooleanPropertyNamed("required", property);
}

export function isNoDataExpression(
	property: TSESTree.ObjectLiteralElement
): property is BooleanProperty {
	return isBooleanPropertyNamed("noDataExpression", property);
}

export function isDisplayName(
	property: TSESTree.ObjectLiteralElement
): property is StringProperty {
	return isStringPropertyNamed("displayName", property);
}

export function isPlaceholder(
	property: TSESTree.ObjectLiteralElement
): property is StringProperty {
	return isStringPropertyNamed("placeholder", property);
}

export function isType(
	property: TSESTree.ObjectLiteralElement
): property is StringProperty {
	return isStringPropertyNamed("type", property);
}

export function isName(
	property: TSESTree.ObjectLiteralElement
): property is StringProperty {
	return isStringPropertyNamed("name", property);
}

export function isHint(
	property: TSESTree.ObjectLiteralElement
): property is StringProperty {
	return isStringPropertyNamed("hint", property);
}

export function isValue(
	property: TSESTree.ObjectLiteralElement
): property is StringProperty {
	return isStringPropertyNamed("value", property);
}

export function isDisplayOptions(
	property: TSESTree.ObjectLiteralElement
): property is ObjectProperty {
	return isObjectPropertyNamed("displayOptions", property);
}

export const isUnaryExpression = (
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

export function isPrimitiveDefault(
	property: TSESTree.ObjectLiteralElement
): property is TSESTree.PropertyNonComputedName & {
	value: { value: string | number | boolean | null };
} {
	return (
		property.type === AST_NODE_TYPES.Property &&
		property.computed === false &&
		property.key.type === AST_NODE_TYPES.Identifier &&
		property.key.name === "default" &&
		property.value.type === AST_NODE_TYPES.Literal
	);
}

export function isTemplateLiteralDefault(
	property: TSESTree.ObjectLiteralElement
): property is TemplateStringProperty {
	return (
		property.type === AST_NODE_TYPES.Property &&
		property.computed === false &&
		property.key.type === AST_NODE_TYPES.Identifier &&
		property.key.name === "default" &&
		property.value.type === AST_NODE_TYPES.TemplateLiteral &&
		property.value.quasis.length > 0
	);
}

export function isObjectDefault(
	property: TSESTree.ObjectLiteralElement
): property is ObjectProperty {
	return isObjectPropertyNamed("default", property);
}

export function isArrayDefault(
	property: TSESTree.ObjectLiteralElement
): property is ArrayProperty {
	return isArrayPropertyNamed("default", property);
}

export function isOptions(
	property: TSESTree.ObjectLiteralElement
): property is OptionsProperty {
	return (
		isArrayPropertyNamed("options", property) ||
		isIdentifierPropertyNamed("options", property)
	);
}

export function isTypeOptions(
	property: TSESTree.ObjectLiteralElement
): property is TSESTree.PropertyNonComputedName & {
	value: {
		properties: TSESTree.ObjectLiteralElement[];
	} & TSESTree.ObjectExpression;
} {
	return isObjectPropertyNamed("typeOptions", property);
}

function isTypeOptionsValue(
	property: TSESTree.ObjectLiteralElement,
	keyName: string,
	valueType: string
): property is NumberProperty {
	return (
		property.type === AST_NODE_TYPES.Property &&
		property.computed === false &&
		property.key.type === AST_NODE_TYPES.Identifier &&
		property.value.type === AST_NODE_TYPES.Literal &&
		property.key.name === keyName &&
		typeof property.value.value === valueType
	);
}

export const isMinValue = (
	property: TSESTree.ObjectLiteralElement
): property is NumberProperty =>
	isTypeOptionsValue(property, "minValue", "number");

export const isMaxValue = (
	property: TSESTree.ObjectLiteralElement
): property is NumberProperty =>
	isTypeOptionsValue(property, "maxValue", "number");

export function isLoadOptionsMethod(
	property: TSESTree.ObjectLiteralElement
): property is NumberProperty {
	return isStringPropertyNamed("loadOptionsMethod", property);
}

export function isDescription(
	property: TSESTree.ObjectLiteralElement
): property is StringProperty {
	return isStringPropertyNamed("description", property);
}

export function isTemplateDescription(
	property: TSESTree.ObjectLiteralElement
): property is TemplateStringProperty {
	return (
		property.type === AST_NODE_TYPES.Property &&
		property.key.type === AST_NODE_TYPES.Identifier &&
		property.key.name === "description" &&
		property.value.type === AST_NODE_TYPES.TemplateLiteral &&
		property.value.quasis.length > 0
	);
}

export function isFixedCollectionValues(
	property: TSESTree.ObjectLiteralElement
): property is ValuesProperty {
	return isArrayPropertyNamed("values", property);
}

export function isDisplayOptionsShow(
	property: TSESTree.ObjectLiteralElement
): property is ObjectProperty {
	return isObjectPropertyNamed("show", property);
}

export function isShowSetting(
	showSettingKey: "resource" | "operation",
	property: TSESTree.ObjectLiteralElement
): property is ArrayProperty {
	return isArrayPropertyNamed(showSettingKey, property);
}

export function isGetAllOptionProperty(
	property: TSESTree.ObjectLiteralElement
) {
	return (
		property.type === AST_NODE_TYPES.Property &&
		property.computed === false &&
		property.key.type === AST_NODE_TYPES.Identifier &&
		property.key.name === "value" &&
		property.value.type === AST_NODE_TYPES.Literal &&
		typeof property.value.value === "string" &&
		property.value.value === "getAll"
	);
}
