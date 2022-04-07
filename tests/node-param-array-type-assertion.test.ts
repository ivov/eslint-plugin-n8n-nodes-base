import rule from "../lib/rules/node-param-array-type-assertion";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test: INodeProperties[] = [
        {
          displayName: 'Test',
          name: 'test',
          type: 'string',
          default: '',
        },
      ];`,
    },
  ],
  invalid: [
    {
      code: `const test = [
        {
          displayName: 'Test',
          name: 'test',
          type: 'string',
          default: '',
        },
      ] as INodeProperties[];`,
      errors: [{ messageId: "typeArray" }],
      output: `const test: INodeProperties[] = [
        {
          displayName: 'Test',
          name: 'test',
          type: 'string',
          default: '',
        },
      ];`,
    },
  ],
});
