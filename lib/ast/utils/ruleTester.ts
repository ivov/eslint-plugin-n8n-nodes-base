// eslint-disable-next-line import/no-extraneous-dependencies
import DocRuleTester from "eslint-docgen/src/rule-tester";

export const ruleTester = () =>
	new DocRuleTester({
		parser: require.resolve("@typescript-eslint/parser"),
	});
