import type { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import type { RuleContext } from "@typescript-eslint/utils/ts-eslint";

type BaseProperty = TSESTree.PropertyNonComputedName;

export type BooleanProperty = BaseProperty & {
	value: {
		type: AST_NODE_TYPES.ObjectExpression;
		value: boolean;
	};
};

export type NumberProperty = BaseProperty & {
	value: {
		type: AST_NODE_TYPES.ObjectExpression;
		value: number;
	};
};

export type StringProperty = BaseProperty & {
	value: {
		type: AST_NODE_TYPES.ObjectExpression;
		value: string;
	};
};

export type ObjectProperty = BaseProperty & {
	value: TSESTree.ObjectExpression;
};

export type ArrayProperty = BaseProperty & {
	value: TSESTree.ArrayExpression;
};

export type OptionsProperty = BaseProperty & {
	value: { elements: TSESTree.ObjectExpression[] };
};

export type ValuesProperty = OptionsProperty;

export type TemplateStringProperty = BaseProperty & {
	value: { quasis: TSESTree.TemplateElement[] };
};

export type StringClassField = TSESTree.PropertyDefinitionNonComputedName & {
	value: { value: string };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericContext = Readonly<RuleContext<any, any>>; // @TODO: Type properly
