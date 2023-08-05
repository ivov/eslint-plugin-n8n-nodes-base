import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`description` in option in options-type node parameter must not be identical to `name`.",
			recommended: "strict",
		},
		schema: [],
		fixable: "code",
		messages: {
			removeDescription: "Remove omittable description [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isOption(node)) return;

				const description = getters.nodeParam.getDescription(node);

				if (!description) return;

				const name = getters.nodeParam.getName(node);

				if (!name) return;

				const triviaLess = description.value
					.replace(/^The\s/g, "")
					.replace(/\.$/, "");

				if (triviaLess.toLowerCase() === name.value.toLowerCase()) {
					const rangeToRemove = utils.getRangeToRemove(description);

					context.report({
						messageId: "removeDescription",
						node: description.ast,
						fix: (fixer) => fixer.removeRange(rangeToRemove),
					});
				}
			},
		};
	},
});
