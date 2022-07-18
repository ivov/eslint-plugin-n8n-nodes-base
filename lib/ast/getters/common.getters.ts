import { TSESTree } from "@typescript-eslint/utils";

export function getClassName(classDeclaration: TSESTree.ClassDeclaration) {
	if (!classDeclaration.id) return null;

	return {
		ast: classDeclaration.id,
		value: classDeclaration.id.name,
	};
}
