import * as utils from "../utils";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "`default` for an options-type node parameter must be one of the options.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      chooseOption:
        "Set one of {{ eligibleOptions }} as default [autofixable]",
      setEmptyString:
        "Set an empty string as default [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isOptionsType(node)) return;

        const _default = getters.nodeParam.getDefault(node);

        if (!_default) return;

        const options = getters.nodeParam.getOptions(node);

        if (options) {
          const eligibleOptions = options.value.reduce<unknown[]>(
            (acc, option) => {
              return acc.push(`${option.value}`), acc;
            },
            []
          );

          if (!eligibleOptions.includes(_default.value)) {
            context.report({
              messageId: "chooseOption",
              data: {
                eligibleOptions: eligibleOptions
                  .map((option) => `'${option}'`)
                  .join(" or "),
              },
              node: _default.ast,
              fix: (fixer) => {
                return fixer.replaceText(
                  _default.ast,
                  `default: '${eligibleOptions[0]}'`
                );
              },
            });
          }
        } else if (_default.value !== "") {
          // if no options, assume node parameter is dynamic options, whether
          // typeOptions.loadOptions has been specified yet or not

          context.report({
            messageId: "setEmptyString",
            node: _default.ast,
            fix: (fixer) => {
              return fixer.replaceText(_default.ast, `default: ''`);
            },
          });
        }
      },
    };
  },
});
