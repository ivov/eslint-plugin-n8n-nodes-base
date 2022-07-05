import { utils } from "../ast/utils";
import { getters } from "../ast/getters";
import { id } from "../ast/identifiers";

const {
  nodeExecuteBlock: {
    isSingularPairingStatement,
    hasValidSingularPairingArgument,
  },
} = id;

const {
  nodeExecuteBlock: { getOperationConsequents, getMarkedNodeFromConsequent },
} = getters;

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    docs: {
      description: `Every non-\`getAll\` operation in the \`execute()\` method in a node must implement singular pairing:
      \`\`\`ts
        returnData.push({
          json: responseData,
          pairedItem: {
            item: i,
          },
        });
        \`\`\`        
        `,
      recommended: "error",
    },
    schema: [],
    messages: {
      missingSingularPairing:
        "Last statement inside this check is not singular pairing [non-autofixable]",
      invalidSingularPairingArgument:
        "Invalid argument for singular pairing [non-autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      MethodDefinition(node) {
        const filepath = context.getFilename();

        // rule only applicable to community nodes
        if (!utils.isNodeFile(filepath) || isOfficialNode(filepath)) return;

        const result = getOperationConsequents(node, { type: "singular" });

        if (!result) return;

        const {
          operationConsequents,
          returnDataArrayName,
          inputItemsIndexName,
        } = result;

        for (const consequent of operationConsequents) {
          const lastStatement = consequent.body[consequent.body.length - 1];

          if (!isSingularPairingStatement(lastStatement, returnDataArrayName)) {
            const markedNode = getMarkedNodeFromConsequent(consequent);

            if (!markedNode) continue;

            context.report({
              messageId: "missingSingularPairing",
              node: markedNode,
            });

            continue;
          }

          if (
            !hasValidSingularPairingArgument(lastStatement, inputItemsIndexName)
          ) {
            context.report({
              messageId: "invalidSingularPairingArgument",
              node: lastStatement.expression,
            });

            continue;
          }
        }
      },
    };
  },
});

const isOfficialNode = (filename: string) =>
  filename.includes("packages/nodes");
