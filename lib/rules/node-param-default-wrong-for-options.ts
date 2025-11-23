import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`default` for an options-type node parameter must be one of the options.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			chooseOption: "Set one of {{ eligibleOptions }} as default [autofixable]",
			setEmptyString: "Set an empty string as default [autofixable]",
			constWrongValue: "Const used in default must be one of {{ eligibleOptions }}",
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

				// If typeOptions.loadOptionsMethod or typeOptions.loadOptions is present,
				// options are loaded dynamically and any default should be allowed
				const loadOptionsMethod = getters.nodeParam.getLoadOptionsMethod(node);
				const loadOptions = getters.nodeParam.getLoadOptions(node);
				if (loadOptionsMethod || loadOptions) return;

				// If default is a variable or expression (not a literal), validate if possible
				if (_default.isUnparseable) {
					const property = _default.ast as TSESTree.Property;
					if (property.value.type === AST_NODE_TYPES.Identifier) {
						const resolvedValue = utils.resolveIdentifierValue(property.value, context);

						// If we can resolve the value, validate it against options
						if (resolvedValue !== null) {
							const options = getters.nodeParam.getOptions(node);

							// Skip validation if options are dynamic
							if (!options) return;

							if (
								options.hasPropertyPointingToIdentifier ||
								options.hasPropertyPointingToMemberExpression
							) {
								return;
							}

							const eligibleOptions: unknown[] = options.value.map(
								(option) => option.value
							);

							if (!eligibleOptions.includes(resolvedValue)) {
								context.report({
									messageId: "constWrongValue",
									data: {
										eligibleOptions: eligibleOptions.join(" or "),
									},
									node: _default.ast,
								});
							}
						}
					}
					return;
				}

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

				const eligibleOptions: unknown[] = options.value.map(
					(option) => option.value
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
