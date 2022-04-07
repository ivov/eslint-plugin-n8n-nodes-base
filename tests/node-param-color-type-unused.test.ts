import rule from "../lib/rules/node-param-color-type-unused";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Foreground Colour',
        name: 'foregroundColor',
        type: 'color',
        default: '#000000',
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Foreground Colour',
        name: 'foregroundColor',
        type: 'string',
        default: '#000000',
      };`,
      errors: [{ messageId: "useColorParam" }],
      output: `const test = {
        displayName: 'Foreground Colour',
        name: 'foregroundColor',
        type: 'color',
        default: '#000000',
      };`,
    },
  ],
});
