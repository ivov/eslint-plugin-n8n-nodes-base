import rule from "../lib/rules/node-execute-block-double-assertion-for-items";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			class TestNode {
				async execute() {
					const items = this.getInputData();
					const length = items.length;
				}
			}`,
		},
	],
	invalid: [
		{
			code: outdent`
			class TestNode {
				async execute() {
					const items = this.getInputData();
					const length = items.length as unknown as number;
				}
			}`,
			errors: [{ messageId: "removeDoubleAssertion" }],
			output: outdent`
			class TestNode {
				async execute() {
					const items = this.getInputData();
					const length = items.length;
				}
			}`,
		},
		{
			code: outdent`
			class TestNode {
				async execute() {
					const items = this.getInputData();
					const length = (items.length as unknown) as number;
				}
			}`,
			errors: [{ messageId: "removeDoubleAssertion" }],
			output: outdent`
			class TestNode {
				async execute() {
					const items = this.getInputData();
					const length = items.length;
				}
			}`,
		},
	],
});
