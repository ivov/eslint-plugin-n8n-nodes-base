import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`displayName` in node class description for trigger node must be suffixed with `-Trigger`.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			fixInputs: "Suffix with '-Trigger' [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!utils.isTriggerNodeFile(context.getFilename())) return;

				if (!id.isNodeClassDescription(node)) return;

				const displayName = getters.nodeClassDescription.getDisplayName(node);

				if (!displayName) return;

				const displayValue = displayName.value.replace(/\s*\(Beta\)$/, ""); // tolerate trailing `(Beta)`

				if (!displayValue.endsWith("Trigger")) {
					const suffixed = `${displayName.value} Trigger`;
					const fixed = utils.keyValue("displayName", suffixed);

					context.report({
						messageId: "fixInputs",
						node: displayName.ast,
						fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
					});
				}
			},
		};
	},
});
