import { NODE_CLASS_DESCRIPTION_SUBTITLE } from "../lib/constants";
import rule from "../lib/rules/node-class-description-outputs-wrong";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `class TestNode {
				description = {
					displayName: 'Test',
					name: 'test',
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
			code: `class TestNode {
				description = {
					displayName: 'Test',
					name: 'test',
					icon: 'file:test.svg',
					group: ['transform'],
					version: 1,
					subtitle: '${NODE_CLASS_DESCRIPTION_SUBTITLE}',
					description: 'This is a sentence',
					defaults: {
						name: 'Test',
					},
					inputs: ['main'],
					outputs: [],
				};
			}`,
			errors: [{ messageId: "fixOutputs" }],
			output: `class TestNode {
				description = {
					displayName: 'Test',
					name: 'test',
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
});
