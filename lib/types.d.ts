import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

export type NodeParamType =
  | "string"
  | "number"
  | "boolean"
  | "options"
  | "multiOptions"
  | "collection"
  | "fixedCollection"
  | "color";

export type IdentifierKey =
  | "displayName" // nodeParameter, fixedCollectionSection, nodeClassDescription
  | "name" // nodeParameter, fixedCollectionSection, nodeClassDescription, option
  | "type" // nodeParameter
  | "default" // nodeParameter
  | "value" // option
  | "values" // fixedCollectionSection
  | "icon"; // nodeClassDescription

export type BooleanProperty = TSESTree.PropertyNonComputedName & {
  value: {
    type: AST_NODE_TYPES.ObjectExpression;
    value: boolean;
  };
};

export type NumberProperty = TSESTree.PropertyNonComputedName & {
  value: {
    type: AST_NODE_TYPES.ObjectExpression;
    value: number;
  };
};

export type StringProperty = TSESTree.PropertyNonComputedName & {
  value: {
    type: AST_NODE_TYPES.ObjectExpression;
    value: string;
  };
};

export type ObjectProperty = TSESTree.PropertyNonComputedName & {
  value: TSESTree.ObjectExpression;
};

export type ArrayProperty = TSESTree.PropertyNonComputedName & {
  value: TSESTree.ArrayExpression;
};

export type OptionsProperty = TSESTree.PropertyNonComputedName & {
  value: { elements: TSESTree.ObjectExpression[] };
};

export type ValuesProperty = OptionsProperty;

export type TemplateStringProperty = TSESTree.PropertyNonComputedName & {
  value: { quasis: TSESTree.TemplateElement[] };
};

export type StringClassField = TSESTree.PropertyDefinitionNonComputedName & {
  value: { value: string };
};
