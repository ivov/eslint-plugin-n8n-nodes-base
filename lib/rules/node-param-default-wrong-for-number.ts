import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`default` for a number-type node parameter must be a number, except for a number-type ID parameter.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			setNumberDefault: "Set a number default [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isNumericType(node)) return;

				const _default = getters.nodeParam.getDefault(node);

				if (!_default) return;

				if (!Boolean(_default.value)) return; // tolerate falsy values for number default

				if (typeof _default.value !== "number") {
					context.report({
						messageId: "setNumberDefault",
						node: _default.ast,
						fix: (fixer) => fixer.replaceText(_default.ast, "default: 0"),
					});
				}
			},
		};
	},
});
