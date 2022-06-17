import * as utils from "../utils";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "Node dirname must match node filename, excluding the filename suffix. Example: `Test` node dirname matches `Test.node.ts` node filename.",
      recommended: "error",
    },
    schema: [],
    messages: {
      renameFile: "Rename node dir to {{ expected }} [non-autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration() {
        const [filename, dirname] = context.getFilename().split("/").reverse();

        if (DIRS_WITH_NESTING.includes(dirname.toLowerCase())) return;

        const parts = filename.split(".node.ts");

        if (parts.length !== 2) return;

        const expected = parts.shift();

        if (!expected) return;

        if (dirname.replace("Trigger", "") !== expected) {
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

const DIRS_WITH_NESTING = [
  "aws",
  "facebook",
  "google",
  "magento",
  "mattermost",
  "microsoft",
  "notion",
  "SyncroMsp",
];