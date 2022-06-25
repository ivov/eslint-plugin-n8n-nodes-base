import { SVG_ICON_SOURCES } from "../constants";
import * as utils from "../ast";
import { id } from "../ast/identifiers";
import { getters } from "../ast/getters";

const iconSources = SVG_ICON_SOURCES.join(" | ");

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: "`icon` in node class description should be an SVG icon.",
      recommended: "error",
    },
    schema: [],
    messages: {
      useSvg: `Try to use an SVG icon. Icon sources: ${iconSources} [non-autofixable]`, // unavailable file
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ObjectExpression(node) {
        if (!id.isNodeClassDescription(node)) return;

        const icon = getters.nodeClassDescription.getIcon(node);

        if (!icon) return;

        if (icon.value.startsWith('fa:')) return;

        if (!icon.value.endsWith(".svg")) {
          context.report({
            messageId: "useSvg",
            node: icon.ast,
          });
        }
      },
    };
  },
});
