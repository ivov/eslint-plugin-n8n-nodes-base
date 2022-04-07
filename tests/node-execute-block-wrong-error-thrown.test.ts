import rule from "../lib/rules/node-execute-block-wrong-error-thrown";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `class TestNode {
        execute() {
          throw new NodeApiError('An error occurred')
        }
      }`,
    },
    {
      code: `class TestNode {
        execute() {
          throw new NodeOperationError('An error occurred')
        }
      }`,
    },
  ],
  invalid: [
    {
      code: `class TestNode {
        execute() {
          throw new Error('An error occurred')
        }
      }`,
      errors: [{ messageId: "useProperError" }],
    },
  ],
});
