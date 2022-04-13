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
      description: `Items in a fixed-collection-type node parameter must be alphabetized by \`displayName\` if more than ${MIN_ITEMS_TO_ALPHABETIZE_IN_FULL}.`,
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      sortItems:
        "Alphabetize by 'displayName'. Order: {{ displayOrder }} [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isFixedCollectionSection(node)) return;

        const values = getters.nodeParam.getFixedCollectionValues(node);

        if (!values) return;

        if (values.value.length < MIN_ITEMS_TO_ALPHABETIZE) return;

        // `values` are node params in a fixed collection
        const sortedParams = [...values.value].sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        );

        const displayOrder = sortedParams
          .reduce<string[]>((acc, cur) => {
            return acc.push(cur.displayName), acc;
          }, [])
          .join(" | ");

        if (!utils.areIdenticallySorted(values.value, sortedParams)) {
          const indentation = utils.getIndentationStringForOption(values);

          const fixed = utils
            .unquoteKeys(sortedParams)
            .replace(/\n/g, `\n${indentation}`);

          context.report({
            messageId: "sortItems",
            node: values.ast,
            data: { displayOrder },
            fix: (fixer) => {
              return fixer.replaceText(values.ast, `values: ${fixed}`);
            },
          });
        }
      },
    };
  },
});
