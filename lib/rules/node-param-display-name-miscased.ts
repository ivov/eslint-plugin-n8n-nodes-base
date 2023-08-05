import { titleCase } from "title-case";
import { DOCUMENTATION } from "../constants";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description: `\`displayName\` in node parameter or in fixed collection section must title cased. ${DOCUMENTATION.APPLICABLE_BY_EXTENSION_TO_NAME}`,
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			useTitleCase: "Change to title case [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				const filename = utils.getNodeFilename(context.getFilename());

				// skip params in GenericFunctions.ts, e.g. Supabase
				if (filename === "GenericFunctions.ts") return;

				// skip ObjectExpression if not being used as param object
				if (id.isArgument(node)) return;

				const isNodeParameter = id.isNodeParameter(node);
				const isFixedCollectionSection = id.isFixedCollectionSection(node);
				const isOption = id.isOption(node);

				if (!isNodeParameter && !isFixedCollectionSection && !isOption) return;

				if (isNodeParameter || isFixedCollectionSection) {
					const displayName = getters.nodeParam.getDisplayName(node);

					if (!displayName) return;

					// prevent overlap with node-param-display-name-wrong-for-dynamic-options
					if (displayName.value.toLowerCase().endsWith("or")) return;

					const type = getters.nodeParam.getType(node);

					if (type?.value === "notice") return; // notice display name is sentence case

					if (utils.isAllowedLowercase(displayName.value)) return;

					const titledCased = titleCase(displayName.value);

					if (displayName.value !== titledCased) {
						const fixed = utils.keyValue("displayName", titledCased);

						context.report({
							messageId: "useTitleCase",
							node: displayName.ast,
							fix: (fixer) => fixer.replaceText(displayName.ast, fixed),
						});
					}
				} else if (isOption) {
					const name = getters.nodeParam.getName(node);

					if (!name) return;

					// prevent overlap with node-param-display-name-wrong-for-dynamic-options
					if (name.value.toLowerCase().endsWith("or")) return;

					if (utils.isAllowedLowercase(name.value)) return;

					const titleCased = titleCase(name.value);

					if (name.value !== titleCased) {
						const fixed = utils.keyValue("name", titleCased);

						context.report({
							messageId: "useTitleCase",
							node: name.ast,
							fix: (fixer) => fixer.replaceText(name.ast, fixed),
						});
					}
				}
			},
		};
	},
});
