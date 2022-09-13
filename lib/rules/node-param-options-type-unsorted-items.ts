import prettier from "prettier";
import {
	MIN_ITEMS_TO_ALPHABETIZE,
	MIN_ITEMS_TO_ALPHABETIZE_SPELLED_OUT,
} from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { PRETTIER_CONFIG } from "../constants";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `Items in options-type node parameter must be alphabetized by \`name\` if ${MIN_ITEMS_TO_ALPHABETIZE_SPELLED_OUT} or more than ${MIN_ITEMS_TO_ALPHABETIZE_SPELLED_OUT}.`,
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			sortItems:
				"Alphabetize by 'name'. Order: {{ displayOrder }} [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isOptionsType(node)) return;

				const optionsNode = getters.nodeParam.getOptions(node);

				if (!optionsNode) return;

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

					const sortedOptionsSource = JSON.stringify(sortedOptions, null, 2);

					const unformattedNewSource = context
						.getSourceCode()
						.getText()
						.replace(optionsSource, sortedOptionsSource);

					const formattedNewSource = prettier
						.format(unformattedNewSource, PRETTIER_CONFIG)
						.trim(); // consume Prettier's EoF newline

					const fullAst = context.getSourceCode().ast;

					context.report({
						messageId: "sortItems",
						node: optionsNode.ast,
						data: { displayOrder },
						fix: (fixer) => fixer.replaceText(fullAst, formattedNewSource),
					});
				}
			},
		};
	},
});

export function toOptions(optionsSource: string): Array<{ name: string }> | null {
	try {
		return eval(`(${optionsSource})`);
	} catch (error) {
		return null;
	}
}
