import rule from "../lib/rules/node-param-placeholder-miscased-id";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: outdent`
			const test = {
				displayName: 'Value ID',
				name: 'valueId',
				type: 'string',
				default: '',
				placeholder: 'The ID of the value',
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Value ID',
				name: 'valueId',
				type: 'string',
				default: '',
				placeholder: 'id,name,description',
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Value ID',
				name: 'valueId',
				type: 'string',
				default: '',
				placeholder: 'SELECT id, name FROM product WHERE quantity > $1 AND price <= $2',
			};`,
    },
  ],
  invalid: [
    {
      code: outdent`
			const test = {
				displayName: 'Value ID',
				name: 'valueId',
				type: 'string',
				default: '',
				placeholder: 'The Id of the value',
			};`,
      errors: [{ messageId: "uppercaseId" }],
      output: outdent`
			const test = {
				displayName: 'Value ID',
				name: 'valueId',
				type: 'string',
				default: '',
				placeholder: 'The ID of the value',
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Value ID',
				name: 'valueId',
				type: 'string',
				default: '',
				placeholder: 'The ids of the value',
			};`,
      errors: [{ messageId: "uppercaseId" }],
      output: outdent`
			const test = {
				displayName: 'Value ID',
				name: 'valueId',
				type: 'string',
				default: '',
				placeholder: 'The IDs of the value',
			};`,
    },
    {
      code: outdent`
			const test = {
				displayName: 'Value ID',
				name: 'valueId',
				type: 'string',
				default: '',
				placeholder: 'The id of the value',
			};`,
      errors: [{ messageId: "uppercaseId" }],
      output: outdent`
			const test = {
				displayName: 'Value ID',
				name: 'valueId',
				type: 'string',
				default: '',
				placeholder: 'The ID of the value',
			};`,
    },
  ],
});
