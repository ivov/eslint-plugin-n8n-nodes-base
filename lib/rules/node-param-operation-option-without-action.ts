import { utils } from "../ast/utils";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";
import { plural } from "pluralize";
import indefinite from "indefinite";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "An option in an Operation node parameter must have an `action` property. The `action` property may or may not be identical to the `description` property.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      addAction: "Add `action: '{{ actionText }}'` [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isOperation(node) && !id.nodeParam.isAction(node)) {
          return;
        }

        const options = getters.nodeParam.getOptions(node);

        if (!options) return;

        if (allOptionsHaveActions(options)) return; // quick check via `value`

        for (const option of options.ast.value.elements) {
          const { properties: optionProperties } = option as {
            properties: TSESTree.Property[];
          };

          const optionHasAction = optionProperties.some(isActionProperty);

          if (optionHasAction) continue;

          let actionText = "<summary>";
          const resourceName = getResourceFromDisplayOptions(node);
          const operationName = getOperationName(optionProperties);

          if (resourceName && operationName) {
            const article = indefinite(resourceName, { articleOnly: true });

            if (operationName === "Get All") {
              actionText = `Get all ${plural(resourceName)}`;
            } else {
              actionText = `${operationName} ${article} ${resourceName}`;
            }
          } else {
            const description = getters.nodeParam.getDescription(option);

            if (!description) continue;

            actionText = description.value;
          }

          const { indentation, range } = utils.getInsertionArgs({
            ast: optionProperties[optionProperties.length - 1],
          });

          const fixed = utils.keyValue("action", actionText);

          context.report({
            data: { actionText },
            messageId: "addAction",
            node: option,
            fix: (fixer) =>
              fixer.insertTextAfterRange(range, `\n${indentation}${fixed},`),
          });
        }
      },
    };
  },
});

function allOptionsHaveActions(options: { value: Array<{ action?: string }> }) {
  return options.value.every((o) => o.action !== undefined);
}

function isActionProperty(property: TSESTree.Property) {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    property.key.name === "action"
  );
}

function isNameProperty(
  property: TSESTree.Property
): property is TSESTree.Property & { value: { value: string } } {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    property.key.name === "name" &&
    property.value.type === AST_NODE_TYPES.Literal &&
    typeof property.value.value === "string"
  );
}

function getResourceFromDisplayOptions(node: TSESTree.ObjectExpression) {
  const displayOptions = node.properties.find(id.nodeParam.isDisplayOptions);

  if (!displayOptions) return null;

  const show = displayOptions.value.properties.find(isShow);

  if (!show) return null;

  const resourceInShow = show.value.properties.find(isResourceInShow);

  if (!resourceInShow) return null;

  /**
   * Assuming 'operation' node param always has `displayOptions.show`
   * pointing to single-item array. TODO: Does multi-item case exist?
   */
  const [resourceName] = resourceInShow.value.elements;

  return resourceName.value;
}

function isShow(
  property: TSESTree.ObjectLiteralElement
): property is TSESTree.PropertyNonComputedName & {
  value: { type: AST_NODE_TYPES.ObjectExpression };
} {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    property.key.name === "show" &&
    property.value.type === AST_NODE_TYPES.ObjectExpression
  );
}

function isResourceInShow(
  property: TSESTree.ObjectLiteralElement
): property is TSESTree.PropertyNonComputedName & {
  value: {
    elements: Array<{
      value: string;
    }>;
  };
} {
  return (
    property.type === AST_NODE_TYPES.Property &&
    property.computed === false &&
    property.key.type === AST_NODE_TYPES.Identifier &&
    property.key.name === "resource" &&
    property.value.type === AST_NODE_TYPES.ArrayExpression
  );
}
function getOperationName(optionProperties: TSESTree.Property[]) {
  const operationNameProperty = optionProperties.find(isNameProperty);

  if (!operationNameProperty) return null;

  return operationNameProperty.value.value;
}
