import {
  MIN_ITEMS_TO_ALPHABETIZE,
  MIN_ITEMS_TO_ALPHABETIZE_IN_FULL,
} from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `Items in options-type node parameter must be alphabetized by \`name\` if ${MIN_ITEMS_TO_ALPHABETIZE_IN_FULL} or more than ${MIN_ITEMS_TO_ALPHABETIZE_IN_FULL}.`,
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

        const options = getters.nodeParam.getOptions(node);

        if (!options) return;

        if (options.value.length < MIN_ITEMS_TO_ALPHABETIZE) return;

        const sortedOptions = [...options.value].sort(utils.optionComparator);

        if (!utils.areIdenticallySortedOptions(options.value, sortedOptions)) {
          const baseIndentation = utils.getBaseIndentationForOption(options);

          const fixed = utils.formatItems(sortedOptions, baseIndentation);

          const displayOrder = utils.toDisplayOrder(sortedOptions);

          context.report({
            messageId: "sortItems",
            node: options.ast,
            data: { displayOrder },
            fix: (fixer) => fixer.replaceText(options.ast, `options: ${fixed}`),
          });
        }
      },
    };
  },
});
