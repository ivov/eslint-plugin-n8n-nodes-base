import rule from "../lib/rules/node-param-description-excess-inner-whitespace";
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
				description: 'This a sentence',
			};`,
		},
		{
			code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Access Token',
				name: 'accessToken',
				type: 'string',
				default: '',
				description: \`The access token must have the following scopes:
				<ul>
					<li>Create/modify webhooks</li>
					<li>View webhooks</li>
					<li>View surveys</li>
					<li>View collectors</li>
					<li>View responses</li>
					<li>View response details</li>
				</ul>\`,
			}`,
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
				description: 'This a  sentence',
			};`,
			errors: [{ messageId: "removeInnerWhitespace" }],
			output: outdent`
			const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This a sentence',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: 'Row ID',
				name: 'rowId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: [
							'table',
						],
						operation: [
							'getRow',
						],
					},
				},
				description: \`ID or name of the row. Names are discouraged because
				they're easily prone to being changed by users. If you're
				using a name, be sure to URI-encode it. If there are
				multiple rows with the same value in the identifying column,
				an arbitrary one will be selected\`,
			};`,
			errors: [{ messageId: "removeInnerWhitespace" }],
			output: outdent`
			const test = {
				displayName: 'Row ID',
				name: 'rowId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: [
							'table',
						],
						operation: [
							'getRow',
						],
					},
				},
				description: 'ID or name of the row. Names are discouraged because they\\'re easily prone to being changed by users. If you\\'re using a name, be sure to URI-encode it. If there are multiple rows with the same value in the identifying column, an arbitrary one will be selected',
			};`,
		},
		{
			code: outdent`
			const test = {
				displayName: "Incident Key",
				name: "incidentKey",
				type: "string",
				default: "",
				description: \`Sending subsequent requests referencing the same service and with the same incident_key
							will result in those requests being rejected if an open incident matches that incident_key.\`,
			}`,
			errors: [{ messageId: "removeInnerWhitespace" }],
			output: outdent`
			const test = {
				displayName: "Incident Key",
				name: "incidentKey",
				type: "string",
				default: "",
				description: 'Sending subsequent requests referencing the same service and with the same incident_key will result in those requests being rejected if an open incident matches that incident_key.',
			}`,
		},
		{
			code: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID    of the user',
			};`,
			errors: [{ messageId: "removeInnerWhitespace" }],
			output: outdent`
			const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
		},
	],
});
