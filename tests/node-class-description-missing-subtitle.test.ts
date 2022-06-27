import { NODE_CLASS_DESCRIPTION_SUBTITLE } from "../lib/constants";
import rule from "../lib/rules/node-class-description-missing-subtitle";
import { ruleTester, getRuleName } from "../lib/ast";
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
					inputs: ['main'],
					outputs: ['main'],
					properties: [
						{
							displayName: 'Resource',
						},
						{
							displayName: 'Operation',
						},
					],
				};
			}`,
    },

		// tolerate `subtitle` absence if no subtitle components (resource + operation)
    {
      code: outdent`
			class TestTriggerNode {
				description = {
					displayName: 'Test Trigger',
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
					name: 'test',
					icon: 'file:test.svg',
					group: ['transform'],
					version: 1,
					description: 'This is a sentence',
					defaults: {
						name: 'Test',
					},
					inputs: ['main'],
					outputs: ['main'],
					properties: [
						{
							displayName: 'Resource',
						},
						{
							displayName: 'Operation',
						},
					],
				};
			}`,
      errors: [{ messageId: "addSubtitle" }],
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
					inputs: ['main'],
					outputs: ['main'],
					properties: [
						{
							displayName: 'Resource',
						},
						{
							displayName: 'Operation',
						},
					],
				};
			}`,
    },
  ],
});
