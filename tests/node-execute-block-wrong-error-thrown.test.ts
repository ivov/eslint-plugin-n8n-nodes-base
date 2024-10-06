import rule from "../lib/rules/node-execute-block-wrong-error-thrown";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			class TestNode {
				execute() {
					throw new NodeApiError(this.getNode(), 'An error occurred')
				}
			}`,
		},
		{
			code: outdent`
			class TestNode {
				execute() {
					throw new NodeOperationError(this.getNode(), 'An error occurred')
				}
			}`,
		},
		{
			code: outdent`
			class TestNode {
				execute() {
					throw new ApplicationError('An error occurred', { level: "warning" });
				}
			}`,
		},
		{
			code: outdent`
			class TestNode {
				execute() {
					throw new TriggerCloseError(this.getNode());
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
