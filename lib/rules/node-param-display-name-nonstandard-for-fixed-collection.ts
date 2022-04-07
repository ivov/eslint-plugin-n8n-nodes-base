import { TSESTree } from "@typescript-eslint/utils";
import { TOP_LEVEL_FIXED_COLLECTION } from "../constants";
import * as utils from "../utils";
import { restoreArray } from "../utils/getters/_restore";
import { identifiers as id } from "../utils/identifiers";
import { getters } from "../utils/getters";

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description:
        "`displayName` for top-level fixed collection for create operation must be `Additional Fields`. `displayName` for top-level fixed collection for update operation must be `Update Fields`. `displayName` for top-level fixed collection for get-all operation must be `Options`.",
      recommended: "error",
    },
    fixable: "code",
    schema: [],
    messages: {
      renameFixedCollection:
        "Rename to '{{ standardDisplayName }}' [autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeParameter(node)) return;

        if (!id.nodeParam.isFixedCollectionType(node)) return;

        const displayName = getters.nodeParam.getDisplayName(node);

        if (!displayName) return;

        // existence of displayOptions implies _top-level_ fixed collection
        const setting = getShowSetting(node, "operation");

        if (!setting || Object.keys(setting).length === 0) return;

        for (const operation of ["create", "update", "getAll"]) {
          const standardDisplayName =
            TOP_LEVEL_FIXED_COLLECTION.STANDARD_DISPLAY_NAME[
              operation.toUpperCase()
            ];

          if (
            setting.operation.includes(operation) &&
            displayName.value !== standardDisplayName
          ) {
            context.report({
              messageId: "renameFixedCollection",
              node: displayName.ast,
              data: { standardDisplayName },
              fix: (fixer) =>
                fixer.replaceText(
                  displayName.ast,
                  `displayName: '${standardDisplayName}'`
                ),
            });
          }
        }
      },
    };
  },
});

/**
 * Get a setting in `displayOptions.show` in a node parameter.
 *
 * - Sample call: `getDisplayOptionsSetting(node, 'operation')`
 * - Sample output: `{ operation: [ 'create', 'close' ] }`
 * - Sample node:
 *
 * ```ts
 * displayOptions: {
 *   show: {
 *     resource: [
 *       'ticket',
 *     ],
 *     operation: [
 *       'create',
 *       'close',
 *     ],
 *   },
 * },
 * ```
 */
export function getShowSetting(
  nodeParam: TSESTree.ObjectExpression,
  showKey: "resource" | "operation"
) {
  for (const property of nodeParam.properties) {
    if (!id.nodeParam.isDisplayOptions(property)) continue;

    return property.value.properties.reduce<Record<string, string[]>>(
      (acc, sub) => {
        if (!id.nodeParam.isDisplayOptionsShow(sub)) return acc;

        for (const subsub of sub.value.properties) {
          if (!id.nodeParam.isShowSetting(showKey, subsub)) continue;

          acc[showKey] = restoreArray(subsub.value.elements);
        }

        return acc;
      },
      {}
    );
  }

  return null;
}
