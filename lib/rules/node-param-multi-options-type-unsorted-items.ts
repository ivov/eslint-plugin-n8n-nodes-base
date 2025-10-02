import {
	MIN_ITEMS_TO_ALPHABETIZE,
	MIN_ITEMS_TO_ALPHABETIZE_SPELLED_OUT,
} from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { toOptions } from "./node-param-options-type-unsorted-items";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `Items in a multi-options-type node parameter must be alphabetized by \`name\` if ${MIN_ITEMS_TO_ALPHABETIZE_SPELLED_OUT} or more than ${MIN_ITEMS_TO_ALPHABETIZE_SPELLED_OUT}.`,
			recommended: "strict",
		},
		schema: [],
		messages: {
			sortItems:
				"Alphabetized by 'name'. Order: {{ displayOrder }} [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isMultiOptionsType(node)) return;

				const optionsNode = getters.nodeParam.getOptions(node);

				if (!optionsNode) return;

				if (optionsNode.hasPropertyPointingToIdentifier) return;

				if (optionsNode.value.length < MIN_ITEMS_TO_ALPHABETIZE) return;

				if (/^\d+$/.test(optionsNode.value[0].value)) return; // do not sort numeric strings

				const optionsSource = context
					.getSourceCode()
					.getText(optionsNode.ast.value);

				const options = toOptions(optionsSource);

				if (!options) return;

				const sortedOptions = [...options].sort(utils.optionComparator);

				if (!utils.areIdenticallySortedOptions(options, sortedOptions)) {
					const displayOrder = utils.toDisplayOrder(sortedOptions);

					context.report({
						messageId: "sortItems",
						node: optionsNode.ast,
						data: { displayOrder },
					});
				}
			},
		};
	},
});
