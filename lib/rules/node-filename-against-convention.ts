import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`name` in node class description must match the node filename without the `.node.ts` suffix. Example: If `description.name` is `Test`, then filename must be `Test.node.ts`.",
			recommended: "strict",
		},
		schema: [],
		messages: {
			renameFile: "Rename file to {{ expected }} [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeClassDescription(node)) return;

				const name = getters.nodeClassDescription.getName(node);

				if (!name) return;

				const actual = utils.getNodeFilename(
					context.getFilename().replace(/\\/g, "/")
				);
				const expected = utils.toExpectedNodeFilename(name.value);

				if (actual !== expected) {
					const topOfFile = { line: 1, column: 1 };

					context.report({
						messageId: "renameFile",
						loc: { start: topOfFile, end: topOfFile },
						data: { expected },
					});
				}
			},
		};
	},
});
