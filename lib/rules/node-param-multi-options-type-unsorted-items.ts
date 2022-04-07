import {
  MIN_ITEMS_TO_ALPHABETIZE,
  MIN_ITEMS_TO_ALPHABETIZE_IN_FULL,
} from "../constants";
import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `Items in a multi-options-type node parameter must be alphabetized by \`name\` if more than ${MIN_ITEMS_TO_ALPHABETIZE_IN_FULL}.`,
      recommended: "error",
    },
    fixable: "code",
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

        const options = getters.nodeParam.getOptions(node);

        if (!options) return;

        if (options.value.length < MIN_ITEMS_TO_ALPHABETIZE) return;

        const sortedOptions = [...options.value].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        const displayOrder = sortedOptions
          .reduce<string[]>((acc, cur) => {
            return acc.push(cur.name), acc;
          }, [])
          .join(" | ");

        if (!utils.areIdenticallySorted(options.value, sortedOptions)) {
          const indentation = utils.getIndentationString(options);

          const fixed = utils
            .unquoteKeys(sortedOptions)
            .replace(/\n/g, `\n${indentation}`);

          context.report({
            messageId: "sortItems",
            node: options.ast,
            data: { displayOrder },
            fix: (fixer) => {
              return fixer.replaceText(options.ast, `options: ${fixed}`);
            },
          });
        }
      },
    };
  },
});
