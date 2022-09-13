import { TSESTree } from "@typescript-eslint/utils";
import { id } from "../identifiers";
import { restoreValue } from "../utils/restoreValue";
import type { GenericContext, StringClassField } from "../../types";

// ----------------------------------
//          credClassBody
// ----------------------------------

function getStringClassField(
	identifier: (f: TSESTree.ClassElement) => f is StringClassField,
	nodeParam: TSESTree.ClassBody
) {
	const found = nodeParam.body.find(identifier);

	if (!found) return null;

	return {
		ast: found,
		value: found.value.value,
	};
}

export function getName(classBody: TSESTree.ClassBody) {
	return getStringClassField(id.credClassBody.isName, classBody);
}

export function getDisplayName(classBody: TSESTree.ClassBody) {
	return getStringClassField(id.credClassBody.isDisplayName, classBody);
}

export function getDocumentationUrl(classBody: TSESTree.ClassBody) {
	return getStringClassField(id.credClassBody.isDocumentationUrl, classBody);
}

export function getPlaceholder(classBody: TSESTree.ClassBody) {
	return getStringClassField(id.credClassBody.isPlaceholder, classBody);
}

/**
 * Get the value for the `extends` field in a cred class, e.g. `[ 'oAuth2Api' ]`
 */
export function getExtendsValue(
	classBody: TSESTree.ClassBody,
	context: GenericContext
) {
	const extendsNode = classBody.body.find(id.credClassBody.isFieldExtends);

	if (!extendsNode) return null;

	const extendsSource = context.getSourceCode().getText(extendsNode.value);

	return restoreValue<string[]>(extendsSource) ?? null;
}
