import { OptionsProperty } from "../types";
import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "layout",
		docs: {
			description:
				"`name` under `credentials` in node class description must be suffixed with `-Api`.",
			recommended: "error",
		},
		fixable: "code",
		schema: [],
		messages: {
			fixSuffix: "Suffix with `-Api` [autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ObjectExpression(node) {
				if (!id.isNodeClassDescription(node)) return;

				if (hasCredExemptedFromApiSuffix(context.getFilename())) return;

				const credOptions = getters.nodeClassDescription.getCredOptions(node);

				if (!credOptions) return;

				const unsuffixed = getUnsuffixedCredOptionName(credOptions);

				if (unsuffixed) {
					const suffixed = utils.addApiSuffix(unsuffixed.value);
					const fixed = utils.keyValue("name", suffixed);

					context.report({
						messageId: "fixSuffix",
						node: unsuffixed.ast,
						fix: (fixer) => fixer.replaceText(unsuffixed.ast, fixed),
					});
				}
			},
		};
	},
});

export function getUnsuffixedCredOptionName(credOptions: {
	ast: OptionsProperty;
}) {
	for (const credOption of credOptions.ast.value.elements) {
		for (const property of credOption.properties) {
			if (
				id.nodeClassDescription.isName(property) &&
				typeof property.value.value === "string" &&
				!property.value.value.endsWith("Api")
			) {
				return {
					ast: property,
					value: property.value.value,
				};
			}
		}
	}

	return null;
}

/**
 * Example:
 *
 * ```ts
 * export class Wait implements INodeType {
 *  description: INodeTypeDescription = {
 *  displayName: 'Wait',
 *  name: 'wait',
 *  icon: 'fa:pause-circle',
 *  group: ['organization'],
 *  version: 1,
 *  description: 'Wait before continue with execution',
 *  defaults: {
 *    name: 'Wait',
 *    color: '#804050',
 *  },
 *  inputs: ['main'],
 *  outputs: ['main'],
 *  credentials: [
 *    {
 *      name: 'httpBasicAuth', // ← Exempted from `-Api` suffix
 *      required: true,
 *      displayOptions: {
 *        show: {
 *          incomingAuthentication: [
 *            'basicAuth',
 *          ],
 *        },
 *      },
 *    },
 * // ...
 * }
 * ```
 */
const NODES_EXEMPTED_FROM_HAVING_CREDS_WITH_API_SUFFIX = [
	"Amqp",
	"Aws",
	"CrateDb",
	"EmailReadImap",
	"EmailSend",
	"FileMaker",
	"Ftp",
	"Git",
	"Google",
	"GraphQL",
	"HttpRequest",
	"Hubspot",
	"Kafka",
	"MQTT",
	"Microsoft",
	"MongoDb",
	"MySql",
	"NocoDB",
	"Pipedrive",
	"Postgres",
	"QuestDb",
	"RabbitMQ",
	"Redis",
	"S3",
	"Snowflake",
	"Ssh",
	"TimescaleDb",
	"Wait",
	"Webhook",
];

function hasCredExemptedFromApiSuffix(filename: string) {
	return NODES_EXEMPTED_FROM_HAVING_CREDS_WITH_API_SUFFIX.some((cred) =>
		filename.includes(cred)
	);
}
