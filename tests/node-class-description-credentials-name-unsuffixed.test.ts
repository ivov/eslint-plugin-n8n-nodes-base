import { NODE_CLASS_DESCRIPTION_SUBTITLE } from "../lib/constants";
import rule from "../lib/rules/node-class-description-credentials-name-unsuffixed";
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
					credentials: [
						{
							name: 'testOAuth2Api',
						},
						{
							name: 'testApi',
						},
					],
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
					outputs: ['main'],
					credentials: [
						{
							name: 'testOAuth2',
						},
						{
							name: 'testApi',
						},
					],
				};
			}`,
			errors: [{ messageId: "fixSuffix" }],
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
					credentials: [
						{
							name: 'testOAuth2Api',
						},
						{
							name: 'testApi',
						},
					],
				};
			}`,
		},

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
					credentials: [
						{
							name: 'testOAuth2Ap',
						},
						{
							name: 'testApi',
						},
					],
				};
			}`,
			errors: [{ messageId: "fixSuffix" }],
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
					credentials: [
						{
							name: 'testOAuth2Api',
						},
						{
							name: 'testApi',
						},
					],
				};
			}`,
		},

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
					credentials: [
						{
							name: 'testOAuth2A',
						},
						{
							name: 'testApi',
						},
					],
				};
			}`,
			errors: [{ messageId: "fixSuffix" }],
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
					credentials: [
						{
							name: 'testOAuth2Api',
						},
						{
							name: 'testApi',
						},
					],
				};
			}`,
		},
	],
});
