import { utils } from "../ast/utils";
import { getters } from "../ast/getters";
import { id } from "../ast/identifiers";

// TODO: Mark as Yes/No in `Autofixable` column in README table

const {
  nodeExecuteBlock: { isPluralPairingStatement, hasValidPluralPairingArgument },
} = id;

const {
  nodeExecuteBlock: { getOperationConsequents, getMarkedNodeFromConsequent },
} = getters;

export default utils.createRule({
  name: utils.getRuleName(module),
  meta: {
    type: "layout",
    fixable: "code",
    docs: {
      description: `Every \`getAll\` operation in the \`execute()\` method in a node must implement plural pairing:
      \`\`\`ts
        returnData.push(
          ...responseData.map((json) => {
            return {
              json,
              pairedItem: {
                item: i,
              },
            };
          })
        );
        \`\`\`        
        `,
      recommended: "error",
    },
    schema: [],
    messages: {
      missingPluralPairing:
        "Last statement inside this check is not plural pairing [autofixable]",
      invalidPluralPairingArgument:
        "Invalid argument for plural pairing [non-autofixable]",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      MethodDefinition(node) {
        if (!utils.isNodeFile(context.getFilename())) return;

        // plural rule applies to both official nodes and community nodes

        const result = getOperationConsequents(node, { type: "plural" });

        if (!result) return;

        const {
          operationConsequents,
          returnDataArrayName,
          inputItemsIndexName,
        } = result;

        for (const opConsequent of operationConsequents) {
          const lastStatement = opConsequent.body[opConsequent.body.length - 1];

          if (!isPluralPairingStatement(lastStatement, returnDataArrayName)) {
            context.report({
              messageId: "missingPluralPairing",
              node: getMarkedNodeFromConsequent(opConsequent) ?? opConsequent,
              // TODO: Autofix
            });

            continue;
          }

          if (
            !hasValidPluralPairingArgument(lastStatement, inputItemsIndexName)
          ) {
            context.report({
              messageId: "invalidPluralPairingArgument",
              node: lastStatement.expression,
            });

            continue;
          }
        }
      },
    };
  },
});
