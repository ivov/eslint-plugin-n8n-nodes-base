import rule from "../lib/rules/node-param-description-comma-separated-hyphen";
import { ruleTester, getRuleName } from "../lib/ast";
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
				description: 'A comma-separated list',
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'Comma-separated list',
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
				description: 'A comma separated list',
			};`,
      errors: [{ messageId: "hyphenate" }],
      output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'A comma-separated list',
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'Comma separated list',
			};`,
      errors: [{ messageId: "hyphenate" }],
      output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'Comma-separated list',
			};`,
    },
  ],
});
