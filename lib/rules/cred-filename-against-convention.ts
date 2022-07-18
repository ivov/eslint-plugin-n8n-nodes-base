import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

// expected filename based on class name

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description:
				"Credentials filename must match credentials class name, excluding the filename suffix. Example: `TestApi.credentials.ts` matches `TestApi` in `class TestApi implements ICredentialType`.",
			recommended: "error",
		},
		schema: [],
		messages: {
			renameFile: "Rename file to {{ expected }} [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ClassDeclaration(node) {
				if (!id.isCredentialClass(node)) return;

				const actual = context.getFilename().split("/").pop();

				if (!actual) return;

				const className = getters.getClassName(node);

				if (!className) return;

				const expected = className.value + ".credentials.ts";

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
