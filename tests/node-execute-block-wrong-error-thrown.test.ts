import rule from "../lib/rules/node-execute-block-wrong-error-thrown";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			class TestNode {
				execute() {
					throw new NodeApiError('An error occurred')
				}
			}`,
		},
		{
			code: outdent`
			class TestNode {
				execute() {
					throw new NodeOperationError('An error occurred')
				}
			}`,
		},
	],
	invalid: [
		{
			code: outdent`
			class TestNode {
				execute() {
					throw new Error('An error occurred')
				}
			}`,
			errors: [{ messageId: "useProperError" }],
		},
	],
});
