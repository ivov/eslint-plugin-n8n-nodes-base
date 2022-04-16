import rule from "../lib/rules/node-param-description-weak";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
			};`,
    },
    {
      code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
			};`,
    },
  ],
  invalid: [
    {
      code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'Operation to perform',
			};`,
      errors: [{ messageId: "removeWeakDescription" }],
      output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'The operation to perform',
			};`,
      errors: [{ messageId: "removeWeakDescription" }],
      output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
			};`,
    },
    {
      code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'Operation to perform',
			};`,
      errors: [{ messageId: "removeWeakDescription" }],
      output: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
			};`,
    },
  ],
});
