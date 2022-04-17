import { IGNORE_SSL_ISSUES_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-wrong-for-ignore-ssl-issues";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: '${IGNORE_SSL_ISSUES_NODE_PARAMETER.DISPLAY_NAME}',
				name: 'allowUnauthorizedCerts',
				type: 'boolean',
				default: true,
				description: '${IGNORE_SSL_ISSUES_NODE_PARAMETER.DESCRIPTION}'
			};`,
		},
	],
	invalid: [
		{
			code: outdent`
			const test = {
				displayName: '${IGNORE_SSL_ISSUES_NODE_PARAMETER.DISPLAY_NAME}',
				name: 'allowUnauthorizedCerts',
				type: 'boolean',
				default: true,
				description: 'Wrong'
			};`,
			errors: [{ messageId: "useIgnoreSslDescription" }],
			output: outdent`
			const test = {
				displayName: '${IGNORE_SSL_ISSUES_NODE_PARAMETER.DISPLAY_NAME}',
				name: 'allowUnauthorizedCerts',
				type: 'boolean',
				default: true,
				description: '${IGNORE_SSL_ISSUES_NODE_PARAMETER.DESCRIPTION}'
			};`,
		},
	],
});
