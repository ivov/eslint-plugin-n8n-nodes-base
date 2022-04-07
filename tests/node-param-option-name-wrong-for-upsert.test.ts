import rule from "../lib/rules/node-param-option-name-wrong-for-upsert";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        name: 'Upsert',
        value: 'upsert',
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        name: 'Insert or Create',
        value: 'upsert',
      };`,
      errors: [{ messageId: "useUpsert" }],
      output: `const test = {
        name: 'Upsert',
        value: 'upsert',
      };`,
    },
  ],
});
