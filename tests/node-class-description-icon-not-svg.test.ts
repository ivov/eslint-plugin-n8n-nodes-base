import { NODE_CLASS_DESCRIPTION_SUBTITLE } from "../lib/constants";
import rule from "../lib/rules/node-class-description-icon-not-svg";
import { getRuleName, ruleTester } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			class TestNode {
				description = {
					displayName: 'TestTrigger',
					name: 'testTrigger',
					icon: 'file:test.svg',
					group: ['transform'],
					version: 1,
					subtitle: '${NODE_CLASS_DESCRIPTION_SUBTITLE}',
					description: 'This is a sentence',
					defaults: {
						name: 'Test',
					},
					inputs: ['main'],
					outputs: ['main'],
				};
			}`,
		},
	],
	invalid: [
		{
			code: outdent`
			class TestNode {
				description = {
					displayName: 'Test',
					name: 'testTrigger',
					icon: 'file:test.png',
					group: ['transform'],
					version: 1,
					subtitle: '${NODE_CLASS_DESCRIPTION_SUBTITLE}',
					description: 'This is a sentence',
					defaults: {
						name: 'Test',
					},
					inputs: ['main'],
					outputs: ['main'],
				};
			}`,
			errors: [{ messageId: "useSvg" }],
		},
	],
});
