import { DOCUMENTATION } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`displayName\` in node parameter or in fixed collection section must not contain excess inner whitespace. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_NAME}`,
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			removeInnerWhitespace: "Remove excess inner whitespace [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				const isNodeParameter = id.isNodeParameter(node);
				const isFixedCollectionSection = id.isFixedCollectionSection(node);
				const isOption = id.isOption(node);

				if (!isNodeParameter && !isFixedCollectionSection && !isOption) return;

				if (isNodeParameter || isFixedCollectionSection) {
					const displayName = getters.nodeParam.getDisplayName(node);

					if (!displayName) return;

					if (/\s{2,}/.test(displayName.value)) {
						const withoutExcess = displayName.value.replace(/\s{2,}/g, " ");
						const fixed = utils.keyValue("displayName", withoutExcess);

						context.report({
							messageId: "removeInnerWhitespace",
							node: displayName.ast,
							fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
						});
					}
				} else if (isOption) {
					const name = getters.nodeParam.getName(node);

					if (!name) return;

					if (/\s{2,}/.test(name.value)) {
						const withoutExcess = name.value.replace(/\s{2,}/g, " ");
						const fixed = utils.keyValue("name", withoutExcess);

						context.report({
							messageId: "removeInnerWhitespace",
							node: name.ast,
							fix: (fixer) => fixer.replaceText(name.ast, fixed),
						});
					}
				}
			},
		};
	},
});
