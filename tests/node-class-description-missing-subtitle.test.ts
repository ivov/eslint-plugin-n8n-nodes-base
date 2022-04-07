import { NODE_CLASS_DESCRIPTION_SUBTITLE } from "../lib/constants";
import rule from "../lib/rules/node-class-description-missing-subtitle";
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
          description: 'This is a sentence',
          defaults: {
            name: 'Test',
          },
          inputs: ['main'],
          outputs: ['main'],
        };
      }`,
      errors: [{ messageId: "addSubtitle" }],
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
