import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

// @TODO: Rename to node-class-description-description-empty-string

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`description` in node class description must be filled out.",
			recommended: "strict",
		},
		schema: [],
		messages: {
			fillOutDescription: "Fill out description [non-autofixable]", // unknowable description
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeClassDescription(node)) return;

				const description = getters.nodeClassDescription.getDescription(node);

				if (!description) return;

				if (description.value === "") {
					context.report({
						messageId: "fillOutDescription",
						node: description.ast,
					});
				}
			},
		};
	},
});
