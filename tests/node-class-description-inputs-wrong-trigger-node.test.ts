import { NODE_CLASS_DESCRIPTION_SUBTITLE } from "../lib/constants";
import rule from "../lib/rules/node-class-description-inputs-wrong-trigger-node";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			class TestNode {
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
					inputs: [],
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
			errors: [{ messageId: "fixInputs" }],
			output: outdent`
			class TestNode {
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
					inputs: [],
					outputs: ['main'],
				};
			}`,
		},
		{
			code: outdent`
			class TestNode {
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
					inputs: ['wrong'],
					outputs: ['main'],
				};
			}`,
			errors: [{ messageId: "fixInputs" }],
			output: outdent`
			class TestNode {
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
					inputs: [],
					outputs: ['main'],
				};
			}`,
		},
		{
			code: outdent`
			class TestNode {
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
					inputs: ['main', 'main'],
					outputs: ['main'],
				};
			}`,
			errors: [{ messageId: "fixInputs" }],
			output: outdent`
			class TestNode {
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
					inputs: [],
					outputs: ['main'],
				};
			}`,
		},
	],
});
