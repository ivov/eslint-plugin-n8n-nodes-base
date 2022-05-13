import rule from "../lib/rules/node-param-description-miscased-url";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The URL of the user',
			};`,
    },
    {
      code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The URL of the user',
			};`,
    },
    {
      code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The cURL command',
			};`,
    },
  ],
  invalid: [
    {
      code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The url of the curly user',
			};`,
      errors: [{ messageId: "uppercaseUrl" }],
      output: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The URL of the curly user',
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The Url of the curly user',
			};`,
      errors: [{ messageId: "uppercaseUrl" }],
      output: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'The URL of the curly user',
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'Url of the user',
			};`,
      errors: [{ messageId: "uppercaseUrl" }],
      output: outdent`
			const test = {
				displayName: 'Operation',
				name: 'operation',
				type: 'string',
				default: '',
				description: 'URL of the user',
			};`,
    },
    {
      code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The url of the curly user',
			};`,
      errors: [{ messageId: "uppercaseUrl" }],
      output: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The URL of the curly user',
			};`,
    },
    {
      code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The Url of the curly user',
			};`,
      errors: [{ messageId: "uppercaseUrl" }],
      output: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The URL of the curly user',
			};`,
    },
  ],
});
