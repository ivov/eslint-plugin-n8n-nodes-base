import { utils } from "../ast/utils";
import { getters } from "../ast/getters";
import { id } from "../ast/identifiers";

const {
	nodeExecuteBlock: {
		isSingularPairingStatement,
		hasValidSingularPairingArgument,
	},
} = id;

const {
	nodeExecuteBlock: { getOperationConsequents, getMarkedNodeFromConsequent },
} = getters;

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description: `Every non-\`getAll\` operation in the \`execute()\` method in a node must implement singular pairing.`,
			recommended: "error",
		},
		schema: [],
		messages: {
			missingSingularPairing:
				"Last statement inside this check is not singular pairing [non-autofixable]",
			invalidSingularPairingArgument:
				"Invalid argument for singular pairing [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			MethodDefinition(node) {
				const filepath = context.getFilename();

				if (!utils.isNodeFile(filepath) || isOfficialNode(filepath)) return;

				// singular rule applies only to community nodes

				const result = getOperationConsequents(node, { filter: "singular" });

				if (!result) return;

				const {
					operationConsequents,
					returnDataArrayName,
					inputItemsIndexName,
				} = result;

				for (const opConsequent of operationConsequents) {
					const lastStatement = opConsequent.body[opConsequent.body.length - 1];

					if (!isSingularPairingStatement(lastStatement, returnDataArrayName)) {
						context.report({
							messageId: "missingSingularPairing",
							node: getMarkedNodeFromConsequent(opConsequent) ?? opConsequent,
						});

						continue;
					}

					if (
						!hasValidSingularPairingArgument(lastStatement, inputItemsIndexName)
					) {
						context.report({
							messageId: "invalidSingularPairingArgument",
							node: lastStatement.expression,
						});

						continue;
					}
				}
			},
		};
	},
});

const isOfficialNode = (filename: string) =>
	filename.includes("packages/nodes") || filename.includes("packages\\nodes");
