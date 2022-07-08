import rule from "../lib/rules/node-execute-block-error-missing-item-index";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: outdent`
			class TestNode {
				execute() {
					throw new NodeApiError(this.getNode(), 'An error occurred', { itemIndex: i });
				}
			}`,
    },
    {
    	code: outdent`
    	class TestNode {
    		execute() {
    			throw new NodeOperationError(this.getNode(), 'An error occurred', { itemIndex: i });
    		}
    	}`,
    },
  ],
  invalid: [
    {
      code: outdent`
			class TestNode {
				execute() {
					throw new NodeApiError(this.getNode(), 'An error occurred');
				}
			}`,
      errors: [{ messageId: "addItemIndexArgument" }],
    },
    {
    	code: outdent`
    	class TestNode {
    		execute() {
    			throw new NodeOperationError(this.getNode(), 'An error occurred');
    		}
    	}`,
    	errors: [{ messageId: "addItemIndexArgument" }],
    },
    {
    	code: outdent`
    	class TestNode {
    		execute() {
    			throw new NodeApiError(this.getNode(), 'An error occurred', { testIndex: 1 });
    		}
    	}`,
    	errors: [{ messageId: "addItemIndexArgument" }],
    },
  ],
});
