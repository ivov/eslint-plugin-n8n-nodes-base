import { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { getters } from "../getters";

export const isForLoop = (
	node: TSESTree.Node
): node is TSESTree.ForStatement & {
	body: TSESTree.BlockStatement;
} => node.type === AST_NODE_TYPES.ForStatement;

export const isTryCatch = (
	node: TSESTree.Node
): node is TSESTree.TryStatement => node.type === AST_NODE_TYPES.TryStatement;

export const isResourceChecksRoot = (
	node: TSESTree.Node
): node is TSESTree.IfStatement =>
	node.type === AST_NODE_TYPES.IfStatement &&
	node.test.type === AST_NODE_TYPES.BinaryExpression &&
	node.test.operator === "===" &&
	node.test.left.type === AST_NODE_TYPES.Identifier &&
	node.test.left.name === "resource";

/**
 * Check whether the statement is:
 *
 * ```ts
 * returnData.push(...);
 * ```
 */
export function isPluralPairingStatement(
	lastStatement: TSESTree.Statement,
	returnDataArrayName: string
): lastStatement is TSESTree.ExpressionStatement & {
	expression: {
		type: AST_NODE_TYPES.CallExpression;
	};
} {
	return (
		lastStatement.type === AST_NODE_TYPES.ExpressionStatement &&
		isReturnDataPush(lastStatement, returnDataArrayName) &&
		hasSpreadArgument(lastStatement)
	);
}

const hasSpreadArgument = (
	statement: TSESTree.ExpressionStatement & {
		expression: { type: AST_NODE_TYPES.CallExpression };
	}
) =>
	statement.expression.arguments.length === 1 &&
	statement.expression.arguments[0].type === AST_NODE_TYPES.SpreadElement;

/**
 * Check whether the statement is:
 *
 * ```ts
 * returnData.push({ ... });
 * ```
 */
export function isSingularPairingStatement(
	lastStatement: TSESTree.Statement,
	returnDataArrayName: string
): lastStatement is TSESTree.ExpressionStatement & {
	expression: {
		type: AST_NODE_TYPES.CallExpression;
		arguments: TSESTree.CallExpressionArgument[];
	};
} {
	return (
		lastStatement.type === AST_NODE_TYPES.ExpressionStatement &&
		isReturnDataPush(lastStatement, returnDataArrayName) &&
		hasSingleArgument(lastStatement)
	);
}

const isReturnDataPush = (
	node: TSESTree.ExpressionStatement,
	returnDataArrayName: string
): node is TSESTree.ExpressionStatement & {
	expression: { type: AST_NODE_TYPES.CallExpression };
} => {
	return (
		node.expression.type === AST_NODE_TYPES.CallExpression &&
		node.expression.callee.type === AST_NODE_TYPES.MemberExpression &&
		node.expression.callee.object.type === AST_NODE_TYPES.Identifier &&
		node.expression.callee.object.name === returnDataArrayName &&
		node.expression.callee.property.type === AST_NODE_TYPES.Identifier &&
		node.expression.callee.property.name === "push"
	);
};

const hasSingleArgument = (
	statement: TSESTree.ExpressionStatement & {
		expression: { type: AST_NODE_TYPES.CallExpression };
	}
) => statement.expression.arguments.length === 1;

export function hasValidSingularPairingArgument(
	lastStatement: TSESTree.ExpressionStatement & {
		expression: {
			type: AST_NODE_TYPES.CallExpression;
			arguments: TSESTree.CallExpressionArgument[];
		};
	},
	inputItemsIndexName: string
) {
	const [argument] = lastStatement.expression.arguments;

	if (argument.type !== AST_NODE_TYPES.ObjectExpression) return false;

	/**
	 * ```ts
	 *  json: responseData
	 *  ^---^
	 * ```
	 */
	const hasJsonKey = argument.properties.some(
		(property) =>
			property.type === AST_NODE_TYPES.Property &&
			property.key.type === AST_NODE_TYPES.Identifier &&
			property.key.name === "json"
	);

	if (!hasJsonKey) return false;

	/**
	 * ```ts
	 * json: responseData
	 * //    ^----------^
	 * ```
	 */
	const hasResponseDataValue = argument.properties.some(
		(property) =>
			property.type === AST_NODE_TYPES.Property &&
			property.value.type === AST_NODE_TYPES.Identifier &&
			property.value.name === "responseData"
	);

	if (!hasResponseDataValue) return false;

	/**
	 * ```ts
	 * pairedItem: { item: i }
	 * ^---------^
	 * ```
	 */
	const hasPairedItemKey = argument.properties.some(
		(property) =>
			property.type === AST_NODE_TYPES.Property &&
			property.key.type === AST_NODE_TYPES.Identifier &&
			property.key.name === "pairedItem"
	);

	if (!hasPairedItemKey) return false;

	const pairedItemValue = getters.nodeExecuteBlock.getPairedItemValue(
		argument.properties
	);

	if (!pairedItemValue) return false;

	/**
	 * pairedItem: { item: i }
	 *             ^---------^
	 */
	const hasPairedItemValueContent = pairedItemValue.properties.find(
		(property) => {
			return (
				property.type === AST_NODE_TYPES.Property &&
				property.key.type === AST_NODE_TYPES.Identifier &&
				property.key.name === "item" &&
				property.value.type === AST_NODE_TYPES.Identifier &&
				property.value.name === inputItemsIndexName
			);
		}
	);

	if (!hasPairedItemValueContent) return false;

	return true;
}

// *********************************

/**
 * Check if the argument to `returnData.push()` has the expected shape.
 *
 * ```ts
 * returnData.push(
 *   ...responseData.map((json) => {
 *     return {
 *       json,
 *       pairedItem: {
 *         item: i,
 *       },
 *     };
 *   })
 * );
 * ```
 */
export function hasValidPluralPairingArgument(
	lastStatement: TSESTree.ExpressionStatement & {
		expression: {
			type: AST_NODE_TYPES.CallExpression;
			arguments: TSESTree.CallExpressionArgument[];
		};
	},
	inputItemsIndexName: string
) {
	const [argument] = lastStatement.expression.arguments;

	if (argument.type !== AST_NODE_TYPES.SpreadElement) return false;

	if (argument.argument.type !== AST_NODE_TYPES.CallExpression) return false;

	/**
	 * ...responseData.map((json) => {
	 *    ^--------------^
	 */
	const hasResponseDataMap =
		argument.argument.callee.type === AST_NODE_TYPES.MemberExpression &&
		argument.argument.callee.object.type === AST_NODE_TYPES.Identifier &&
		argument.argument.callee.object.name === "responseData" &&
		argument.argument.callee.property.type === AST_NODE_TYPES.Identifier &&
		argument.argument.callee.property.name === "map";

	if (!hasResponseDataMap) return false;

	if (argument.argument.arguments.length !== 1) return false;

	const [arrowFunction] = argument.argument.arguments;

	/**
	 * .map((json) => { ... });
	 *      ^----------------^
	 */
	const hasArrowFunctionWithJsonArg =
		arrowFunction.type === AST_NODE_TYPES.ArrowFunctionExpression &&
		arrowFunction.params.length === 1 &&
		arrowFunction.params[0].type === AST_NODE_TYPES.Identifier &&
		arrowFunction.params[0].name === "json";

	if (!hasArrowFunctionWithJsonArg) return false;

	const returnsObject =
		arrowFunction.body.type === AST_NODE_TYPES.BlockStatement &&
		arrowFunction.body.body.length === 1 &&
		arrowFunction.body.body[0].type === AST_NODE_TYPES.ReturnStatement &&
		arrowFunction.body.body[0].argument !== null &&
		arrowFunction.body.body[0].argument.type ===
			AST_NODE_TYPES.ObjectExpression;

	if (!returnsObject) return false;

	// @ts-ignore TODO: Type properly
	const { properties } = arrowFunction.body.body[0].argument as {
		properties: TSESTree.Property[];
	};

	const returnedObjectHasJson = properties.some(
		(property) =>
			property.key.type === AST_NODE_TYPES.Identifier &&
			property.key.name === "json" &&
			property.value.type === AST_NODE_TYPES.Identifier &&
			property.value.name === "json"
	);

	if (!returnedObjectHasJson) return false;

	const returnedObjectHasPairedItem = properties.find(
		(property) =>
			property.key.type === AST_NODE_TYPES.Identifier &&
			property.key.name === "pairedItem" &&
			property.value.type === AST_NODE_TYPES.ObjectExpression &&
			property.value.properties.length === 1
	);

	if (!returnedObjectHasPairedItem) return false;

	const pairedItemValue =
		getters.nodeExecuteBlock.getPairedItemValue(properties);

	if (!pairedItemValue) return false;

	/**
	 * pairedItem: { item: i }
	 *             ^---------^
	 */
	const hasPairedItemValueContent = pairedItemValue.properties.find(
		(property) => {
			return (
				property.type === AST_NODE_TYPES.Property &&
				property.key.type === AST_NODE_TYPES.Identifier &&
				property.key.name === "item" &&
				property.value.type === AST_NODE_TYPES.Identifier &&
				property.value.name === inputItemsIndexName
			);
		}
	);

	if (!hasPairedItemValueContent) return false;

	return true;
}
