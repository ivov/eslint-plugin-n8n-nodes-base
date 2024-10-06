import {
	MIN_ITEMS_TO_ALPHABETIZE,
	MIN_ITEMS_TO_ALPHABETIZE_SPELLED_OUT,
} from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `Items in collection-type node parameter must be alphabetized by \`name\` if ${MIN_ITEMS_TO_ALPHABETIZE_SPELLED_OUT} or more than ${MIN_ITEMS_TO_ALPHABETIZE_SPELLED_OUT}.`,
			recommended: "strict",
		},
		schema: [],
		messages: {
			sortItems:
				"Alphabetize by 'name'. Order: {{ displayOrder }} [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isCollectionType(node)) return;

				const options = getters.nodeParam.getCollectionOptions(node);

				if (!options) return;

				if (options.value.length < MIN_ITEMS_TO_ALPHABETIZE) return;

				const sortedOptions = [...options.value].sort(
					utils.optionComparatorForCollection
				);

				if (
					!utils.areIdenticallySortedOptionsForCollection(
						options.value,
						sortedOptions
					)
				) {
					const displayOrder = utils.toDisplayOrderForCollection(sortedOptions);

					context.report({
						messageId: "sortItems",
						node: options.ast,
						data: { displayOrder },
					});
				}
			},
		};
	},
});
