import { utils } from "../ast/utils";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description:
				"Node dirname must match node filename, excluding the filename suffix. Example: `Test` node dirname matches `Test` section of `Test.node.ts` node filename.",
			recommended: "error",
		},
		schema: [],
		messages: {
			renameDir: "Rename node dir to {{ expected }} [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ClassDeclaration() {
				const filepath = context.getFilename();

				if (!filepath.endsWith(".node.ts")) return;

				const [filename, parentDir] = filepath
					.toLowerCase()
					.split("/")
					.reverse()
					.map((i) => i.replace("trigger", ""));

				const expected = filename.replace(".node.ts", "");

				/**
				 * `includes` because nested dirs are sections of full expected name
				 * e.g. /Cisco/Webex/CiscoWebex.node.ts → "ciscowebex".includes("cisco")
				 */
				if (!expected.includes(parentDir)) {
					const topOfFile = { line: 1, column: 1 };

					context.report({
						messageId: "renameDir",
						loc: { start: topOfFile, end: topOfFile },
						data: { expected },
					});
				}
			},
		};
	},
});
