import { IGNORE_SSL_ISSUES_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-missing-for-ignore-ssl-issues";
import { getRuleName } from "../lib/ast";
import outdent from "outdent";
import { ruleTester } from "../lib/ast/utils/ruleTester";

ruleTester().run(getRuleName(module), rule, {
	valid: [
		{
			code: outdent`
			const test = {
				displayName: '${IGNORE_SSL_ISSUES_NODE_PARAMETER.DISPLAY_NAME}',
				name: 'allowUnauthorizedCerts',
				type: 'boolean',
				description: '${IGNORE_SSL_ISSUES_NODE_PARAMETER.DESCRIPTION}',
				default: true,
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
			};`,
			errors: [{ messageId: "addIgnoreSslIssuesDescription" }],
			output: outdent`
			const test = {
				displayName: '${IGNORE_SSL_ISSUES_NODE_PARAMETER.DISPLAY_NAME}',
				name: 'allowUnauthorizedCerts',
				type: 'boolean',
				description: '${IGNORE_SSL_ISSUES_NODE_PARAMETER.DESCRIPTION}',
				default: true,
			};`,
		},
	],
});
