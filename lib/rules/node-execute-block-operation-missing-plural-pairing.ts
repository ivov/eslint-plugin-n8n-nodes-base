import { utils } from "../ast/utils";
import { getters } from "../ast/getters";
import { id } from "../ast/identifiers";

const {
	nodeExecuteBlock: { isPluralPairingStatement, hasValidPluralPairingArgument },
} = id;

const {
	nodeExecuteBlock: { getOperationConsequents, getMarkedNodeFromConsequent },
} = getters;

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		fixable: "code",
		docs: {
			description: `Every \`getAll\` operation in the \`execute()\` method in a node must implement plural pairing.`,
			recommended: "error",
		},
		schema: [],
		messages: {
			missingPluralPairing:
				"Last statement inside this check is not plural pairing [autofixable]",
			invalidPluralPairingArgument:
				"Invalid argument for plural pairing [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			MethodDefinition(node) {
				if (!utils.isNodeFile(context.getFilename())) return;

				// plural rule applies to both official nodes and community nodes

				const result = getOperationConsequents(node, { type: "plural" });

				if (!result) return;

				const {
					operationConsequents,
					returnDataArrayName,
					inputItemsIndexName,
				} = result;

				for (const opConsequent of operationConsequents) {
					const lastStatement = opConsequent.body[opConsequent.body.length - 1];

					if (!isPluralPairingStatement(lastStatement, returnDataArrayName)) {
						const { range, indentation } = utils.getInsertionArgs({
							ast: lastStatement,
						});

						const pluralPairing = makePluralPairing(
							indentation,
							pluralPairingTemplate(returnDataArrayName, inputItemsIndexName)
						);

						context.report({
							messageId: "missingPluralPairing",
							node: getMarkedNodeFromConsequent(opConsequent) ?? opConsequent,
							fix: (fixer) => fixer.insertTextAfterRange(range, pluralPairing),
						});

						continue;
					}

					if (
						!hasValidPluralPairingArgument(lastStatement, inputItemsIndexName)
					) {
						context.report({
							messageId: "invalidPluralPairingArgument",
							node: lastStatement.expression,
						});

						continue;
					}
				}
			},
		};
	},
});

function makePluralPairing(indentation: string, pluralPairingTemplate: string) {
	return [
		"\n",
		pluralPairingTemplate
			.trim()
			.split("\n")
			.map((line) => `${indentation}${line}`)
			.join("\n"),
		"\n",
	].join("");
}

const pluralPairingTemplate = (
	returnDataArrayName: string,
	inputItemsIndexName: string
) => `
${returnDataArrayName}.push(
	...responseData.map((json) => {
		return {
			json,
			pairedItem: {
				item: ${inputItemsIndexName},
			},
		};
	})
);
`;
