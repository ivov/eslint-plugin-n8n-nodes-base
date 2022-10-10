import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`default` for a string-type node parameter must be a string, unless `typeOptions.multipleValues` is set to `true`.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			setStringDefault: "Set a string default [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isStringType(node)) return;

				const _default = getters.nodeParam.getDefault(node);

				if (!_default) return;

				if (_default?.isUnparseable) return;

				const typeOptions = getters.nodeParam.getTypeOptions(node);

				if (
					typeOptions?.value.multipleValues &&
					Array.isArray(_default.value)
				) {
					return;
				}

				if (typeof _default.value !== "string") {
					context.report({
						messageId: "setStringDefault",
						node: _default.ast,
						fix: (fixer) => fixer.replaceText(_default.ast, "default: ''"),
					});
				}
			},
		};
	},
});
