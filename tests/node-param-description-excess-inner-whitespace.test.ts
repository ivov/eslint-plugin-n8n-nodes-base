import rule from "../lib/rules/node-param-description-excess-inner-whitespace";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This a sentence',
			};`,
		},
		{
			code: `const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
		},
		{
			code: `const test = {
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
			code: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This a  sentence',
			};`,
			errors: [{ messageId: "removeInnerWhitespace" }],
			output: `const test = {
				displayName: 'Test',
				name: 'test',
				type: 'string',
				default: '',
				description: 'This a sentence',
			};`,
		},
		{
			code: `const test = {
				displayName: "Incident Key",
				name: "incidentKey",
				type: "string",
				default: "",
				description: \`Sending subsequent requests referencing the same service and with the same incident_key
							will result in those requests being rejected if an open incident matches that incident_key.\`,
			}`,
			errors: [{ messageId: "removeInnerWhitespace" }],
			output: `const test = {
				displayName: "Incident Key",
				name: "incidentKey",
				type: "string",
				default: "",
				description: 'Sending subsequent requests referencing the same service and with the same incident_key will result in those requests being rejected if an open incident matches that incident_key.',
			}`,
		},
		{
			code: `const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID    of the user',
			};`,
			errors: [{ messageId: "removeInnerWhitespace" }],
			output: `const test = {
				name: 'User ID',
				value: 'userId',
				description: 'The ID of the user',
			};`,
		},
	],
});
