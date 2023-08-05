import { camelCase } from "camel-case";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: "`name` in node class description must be camel cased.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			useCamelCase: "Change to camel case [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeClassDescription(node)) return;

				if (!utils.isNodeFile(context.getFilename())) return;

				const name = getters.nodeClassDescription.getName(node);

				if (!name) return;

				const camelCased = camelCase(name.value);

				if (name.value !== camelCased) {
					const fixed = utils.keyValue("name", camelCased);

					context.report({
						messageId: "useCamelCase",
						node: name.ast,
						fix: (fixer) => fixer.replaceText(name.ast, fixed),
					});
				}
			},
		};
	},
});
