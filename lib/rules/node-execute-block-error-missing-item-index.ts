import { utils } from "../ast/utils";
import { getters } from "../ast/getters";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { NODE_ERROR_TYPES } from "../constants";

const {
	nodeExecuteBlock: { getOperationConsequents, collectConsequents },
} = getters;

// TODO: Autofix

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description:
				"In the operations in the `execute()` method in a node, `NodeApiError` and `NodeOperationError` must specify `itemIndex` as the third argument.",
			recommended: "error",
		},
		schema: [],
		messages: {
			addItemIndexSameName:
				"Add `{ itemIndex }` as third argument [non-autofixable]",
			addItemIndexDifferentName:
				"Add `{ itemIndex: {{ indexName }} }` as third argument [non-autofixable]",
			changeThirdArgSameName:
				"Change third argument to `{ itemIndex }` [non-autofixable]",
			changeThirdArgDifferentName:
				"Change third argument to `{ itemIndex: {{ indexName }} }` [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			MethodDefinition(node) {
				if (!utils.isNodeFile(context.getFilename())) return;

				const result = getOperationConsequents(node, { filter: "all" });

				if (!result) return;

				const {
					operationConsequents: opConsequents,
					inputItemsIndexName: indexName,
				} = result;

				const throwStatements = findThrowStatements(opConsequents);

				for (const statement of throwStatements) {
					if (statement.argument === null) continue;

					// actual type of `argument` is `NewExpression`, but `ThrowStatement.argument`
					// is typed in lib as `Statement | TSAsExpression | null`
					const arg = statement.argument as unknown as TSESTree.NewExpression;

					// covered by node-execute-block-wrong-error-thrown
					if (!isNodeErrorType(arg)) continue;

					const { arguments: errorArgs } = arg; // NodeOperationError(_), NodeApiError(_)

					if (errorArgs.length !== 3 && indexName === "itemIndex") {
						context.report({
							messageId: "addItemIndexSameName",
							node: statement,
						});

						continue;
					}

					if (errorArgs.length !== 3 && indexName !== "itemIndex") {
						context.report({
							messageId: "addItemIndexDifferentName",
							node: statement,
							data: { indexName },
						});

						continue;
					}

					const [thirdArg] = errorArgs.slice().reverse();

					if (!isItemIndexArg(thirdArg) && indexName === "itemIndex") {
						context.report({
							messageId: "changeThirdArgSameName",
							node: statement,
						});

						continue;
					}

					if (!isItemIndexArg(thirdArg) && indexName !== "itemIndex") {
						context.report({
							messageId: "changeThirdArgDifferentName",
							node: statement,
							data: { indexName },
						});

						continue;
					}
				}
			},
		};
	},
});

function findIfStatements(consequent: TSESTree.BlockStatement) {
	return consequent.body.filter(
		(statement): statement is TSESTree.IfStatement =>
			statement.type === AST_NODE_TYPES.IfStatement
	);
}

const isThrowStatement = (
	node: TSESTree.BaseNode
): node is TSESTree.ThrowStatement =>
	node.type === AST_NODE_TYPES.ThrowStatement;

/**
 * ```ts
 * if (operation === "create") {
 *
 *  if (customFields === undefined) {
 *    throw new NodeOperationError(this.getNode(), 'Error!'); // nested throw
 *  }
 *
 *  throw new NodeOperationError(this.getNode(), 'Error!'); // top-level throw
 * }
 * ```
 */
function findThrowStatements(operationConsequents: TSESTree.BlockStatement[]) {
	return operationConsequents.reduce<TSESTree.ThrowStatement[]>(
		(acc, operationConsequent) => {
			const topLevelThrows = operationConsequent.body.filter(isThrowStatement);

			const throwStatements = [...topLevelThrows];

			const nestedIfs = findIfStatements(operationConsequent);

			const nestedConsequents = nestedIfs.flatMap((s) => collectConsequents(s));

			const nestedThrows = nestedConsequents.flatMap((c) =>
				c.body.filter(isThrowStatement)
			);

			throwStatements.push(...nestedThrows);

			return [...acc, ...throwStatements];
		},
		[]
	);
}

function isNodeErrorType(newExpressionArg: TSESTree.NewExpression) {
	return (
		newExpressionArg.callee.type === AST_NODE_TYPES.Identifier &&
		NODE_ERROR_TYPES.includes(newExpressionArg.callee.name)
	);
}

function isItemIndexArg(node: TSESTree.Expression) {
	return (
		node.type === AST_NODE_TYPES.ObjectExpression &&
		node.properties.length === 1 &&
		node.properties[0].type === AST_NODE_TYPES.Property &&
		node.properties[0].key.type === AST_NODE_TYPES.Identifier &&
		node.properties[0].key.name === "itemIndex"
	);
}
