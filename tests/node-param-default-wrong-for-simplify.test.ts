import rule from "../lib/rules/node-param-default-wrong-for-simplify";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Simplify',
        name: 'simpl',
        type: 'boolean',
        default: true,
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Simplify',
        name: 'simpl',
        type: 'boolean',
        default: false,
      };`,
      errors: [{ messageId: "setTrueDefault" }],
      output: `const test = {
        displayName: 'Simplify',
        name: 'simpl',
        type: 'boolean',
        default: true,
      };`,
    },
  ],
});
