import { NODE_CLASS_DESCRIPTION_SUBTITLE } from "../lib/constants";
import rule from "../lib/rules/node-execute-block-missing-continue-on-fail";
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
        async execute() {
          for (let i = 0; i < items.length; i++) {
            try {
              // ...
            } catch (error) {
              if (this.continueOnFail()) {
                // ...
              }
            }
          }
        }
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
        };
        async execute() {
          for (let i = 0; i < items.length; i++) {
            try {
              // ...
            } catch (error) {
              // ...
            }
          }
        }
      }`,
      errors: [{ messageId: "addContinueOnFail" }],
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
        };
        async execute() {
          for (let i = 0; i < items.length; i++) {
            // ...
          }
        }
      }`,
      errors: [{ messageId: "addContinueOnFail" }],
    },
  ],
});
