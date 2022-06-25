import * as utils from "../ast";
import { identifiers as id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`default` for an options-type node parameter must be one of the options.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      chooseOption: "Set one of {{ eligibleOptions }} as default [autofixable]",
      setEmptyString: "Set an empty string as default [autofixable]",
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

        /**
         * if no options but default exists, assume node param is dynamic options,
         * regardless of whether `typeOptions.loadOptions` has been specified or not
         */
        if (!options && _default.value !== "") {
          context.report({
            messageId: "setEmptyString",
            node: _default.ast,
            fix: (fixer) => fixer.replaceText(_default.ast, "default: ''"),
          });
        }

        if (!options) return;

        if (
          options.hasPropertyPointingToIdentifier || // e.g. `value: myVar`
          options.hasPropertyPointingToMemberExpression // e.g. `value: MY_OBJECT.myValue`
        ) {
          return;
        }

        const eligibleOptions = options.value.reduce<unknown[]>(
          (acc, option) => {
            return acc.push(option.value), acc;
          },
          []
        );

        if (!eligibleOptions.includes(_default.value)) {
          const zerothOption = eligibleOptions[0];

          const fixed = `default: ${
            typeof zerothOption === "string"
              ? `'${zerothOption}'`
              : zerothOption
          }`;

          context.report({
            messageId: "chooseOption",
            data: {
              eligibleOptions: eligibleOptions.join(" or "),
            },
            node: _default.ast,
            fix: (fixer) => fixer.replaceText(_default.ast, fixed),
          });
        }
      },
    };
  },
});
