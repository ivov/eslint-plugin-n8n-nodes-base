import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

const isTestRun = process.env.NODE_ENV === "test";

export default utils.createRule({
	name: utils.getRuleName(module),
	meta: {
		type: "problem",
		docs: {
			description:
				"`documentationUrl` field in credential class must be an HTTP URL. Only applicable to community credentials.",
			recommended: "strict",
		},
		schema: [],
		messages: {
			useHttpUrl:
				"Use an HTTP URL, e.g. `https://example.com/docs/auth` [non-autofixable]",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			ClassDeclaration(node) {
				const filename = context.getFilename();

				// only apply to community credential
				if (!id.isCredentialClass(node) || !isCommunityCredential(filename)) {
					return;
				}

				const documentationUrl = getters.credClassBody.getDocumentationUrl(
					node.body
				);

				if (!documentationUrl) return;

				if (!isHttpUrl(documentationUrl.value)) {
					context.report({
						messageId: "useHttpUrl",
						node: documentationUrl.ast,
					});
				}
			},
		};
	},
});

function isHttpUrl(string: string) {
	let url;

	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}

	return url.protocol === "http:" || url.protocol === "https:";
}

const isCommunityCredential = (filename: string) =>
	(!filename.includes("packages/credentials") ||
		!filename.includes("packages\\credentials") ||
		isTestRun) &&
	!filename.includes("scratchpad"); // @TODO: Frail check
