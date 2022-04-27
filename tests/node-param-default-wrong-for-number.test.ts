import rule from "../lib/rules/node-param-default-wrong-for-number";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'number',
				default: 0,
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Account Contact ID',
				name: 'accountContactId',
				type: 'number',
				default: '',
				required: true,
			};`,
    },
  ],
  invalid: [
    {
      code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'number',
				default: '0',
			};`,
      errors: [{ messageId: "setNumberDefault" }],
      output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'number',
				default: 0,
			};`,
    },
  ],
});
