import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { sentenceCase } from "sentence-case";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"The property `action` in an option in an Operation node parameter must be sentence-cased.",
			recommended: "strict",
		},
		fixable: "code",
		schema: [],
		messages: {
			useSentenceCase: "Change to sentence case [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeParameter(node)) return;

				if (!id.nodeParam.isOperation(node) && !id.nodeParam.isAction(node)) {
					return;
				}

				const options = getters.nodeParam.getOptions(node);

				if (!options) return;

				if (options.hasPropertyPointingToIdentifier) return;

				// skip `options: [...].sort()`, see EditImage.node.ts
				if (!Array.isArray(options.ast.value.elements)) return;

				for (const option of options.ast.value.elements) {
					const action = option.properties.find(isActionProperty);

					if (!action) continue;

					const actionSentence = action.value.value;

					if (!isSentenceCase(actionSentence)) {
						const sentenceCased = sentenceCase(actionSentence);
						const fixed = utils.keyValue("action", sentenceCased);

						context.report({
							messageId: "useSentenceCase",
							node: action,
							fix: (fixer) => fixer.replaceText(action, fixed),
						});
					}
				}
			},
		};
	},
});

function isActionProperty(
	property: TSESTree.ObjectLiteralElement
): property is TSESTree.Property & { value: { value: string } } {
	return (
		property.type === AST_NODE_TYPES.Property &&
		property.computed === false &&
		property.key.type === AST_NODE_TYPES.Identifier &&
		property.key.name === "action" &&
		property.value.type === AST_NODE_TYPES.Literal &&
		typeof property.value.value === "string"
	);
}

function isSentenceCase(sentence: string) {
	const withoutAllUppercaseWords = sentence
		.split(" ")
		.filter((word) => !isAllUppercase(word)) // tolerate all-uppercase word
		.filter((word) => !word.includes("\\'")) // tolerate escaped single quote
		.join(" ");

	return withoutAllUppercaseWords === sentenceCase(withoutAllUppercaseWords);
}

const isAllUppercase = (str: string) => str === str.toUpperCase();
