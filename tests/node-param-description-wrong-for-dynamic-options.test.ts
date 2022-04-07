import { DYNAMIC_OPTIONS_NODE_PARAMETER } from "../lib/constants";
import rule from "../lib/rules/node-param-description-wrong-for-dynamic-options";
import { ruleTester, getRuleName } from "../lib/utils";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: `const test = {
        displayName: 'Field Name or ID',
        name: 'field',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getFields',
        },
        default: '',
        description: '${DYNAMIC_OPTIONS_NODE_PARAMETER.DESCRIPTION}',
      };`,
    },
  ],
  invalid: [
    {
      code: `const test = {
        displayName: 'Field Name or ID',
        name: 'field',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getFields',
        },
        default: '',
        description: 'Wrong',
      };`,
      errors: [{ messageId: "useStandardDescription" }],
      output: `const test = {
        displayName: 'Field Name or ID',
        name: 'field',
        type: 'options',
        typeOptions: {
          loadOptionsMethod: 'getFields',
        },
        default: '',
        description: '${DYNAMIC_OPTIONS_NODE_PARAMETER.DESCRIPTION}',
      };`,
    },
  ],
});
