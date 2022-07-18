import { TSESTree } from "@typescript-eslint/utils";
import { id } from "../identifiers";
import { restoreArray } from "../restorers";
import type { StringClassField } from "../../types";

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

export function getExtendsOAuth2(classBody: TSESTree.ClassBody) {
	const found = classBody.body.find(id.credClassBody.isFieldExtends);

	if (!found) return null;

	return {
		ast: found,
		value: restoreArray(found.value.elements),
	};
}
