import rule from "../lib/rules/node-param-option-name-wrong-for-get-all";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        name: 'Get All',
        value: 'getAll',
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        name: 'List',
        value: 'getAll',
      };`,
      errors: [{ messageId: "useGetAll" }],
      output: `const test = {
        name: 'Get All',
        value: 'getAll',
      };`,
    },
  ],
});
