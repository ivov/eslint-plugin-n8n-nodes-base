import rule from "../lib/rules/node-execute-block-error-missing-item-index";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: outdent`
			class TestNode {
				async execute() {
					const items = this.getInputData();
					const returnData: INodeExecutionData[] = [];

					const resource = this.getNodeParameter('resource', 0) as string;
					const operation = this.getNodeParameter('operation', 0) as string;

					let responseData;

					for (let i = 0; i < items.length; i++) {

						try {
							
							if (resource === 'ticket') {

								if (operation === 'create') {

									responseData = await serviceApiRequest.call(this, 'POST', '/tickets', body);

									throw new NodeOperationError(this.getNode(), "Error!", { itemIndex: i });

								}

							}

						} catch (error) {
							if (this.continueOnFail()) {
								// ...
							}
						}
					}

					return [returnData];
				}
			}`,
    },
  ],
  invalid: [
    {
      code: outdent`
			class TestNode {
				async execute() {
					const items = this.getInputData();
					const returnData: INodeExecutionData[] = [];

					const resource = this.getNodeParameter('resource', 0) as string;
					const operation = this.getNodeParameter('operation', 0) as string;

					let responseData;

					for (let i = 0; i < items.length; i++) {

						try {
							
							if (resource === 'ticket') {

								if (operation === 'create') {

									responseData = await serviceApiRequest.call(this, 'POST', '/tickets', body);

									throw new NodeOperationError(this.getNode(), "Error!");

								}

							}

						} catch (error) {
							if (this.continueOnFail()) {
								// ...
							}
						}
					}

					return [returnData];
				}
			}`,
      errors: [
        { messageId: "addItemIndexDifferentName", data: { indexName: "i" } },
      ],
    },
    {
      code: outdent`
			class TestNode {
				async execute() {
					const items = this.getInputData();
					const returnData: INodeExecutionData[] = [];

					const resource = this.getNodeParameter('resource', 0) as string;
					const operation = this.getNodeParameter('operation', 0) as string;

					let responseData;

					for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {

						try {
							
							if (resource === 'ticket') {

								if (operation === 'create') {

									responseData = await serviceApiRequest.call(this, 'POST', '/tickets', body);

									throw new NodeOperationError(this.getNode(), "Error!");

								}

							}

						} catch (error) {
							if (this.continueOnFail()) {
								// ...
							}
						}
					}

					return [returnData];
				}
			}`,
      errors: [
        { messageId: "addItemIndexSameName", data: { indexName: "itemIndex" } },
      ],
    },
    {
      code: outdent`
			class TestNode {
				async execute() {
					const items = this.getInputData();
					const returnData: INodeExecutionData[] = [];

					const resource = this.getNodeParameter('resource', 0) as string;
					const operation = this.getNodeParameter('operation', 0) as string;

					let responseData;

					for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {

						try {
							
							if (resource === 'ticket') {

								if (operation === 'create') {

									responseData = await serviceApiRequest.call(this, 'POST', '/tickets', body);

									throw new NodeOperationError(this.getNode(), "Error!", { test: 123 });

								}

							}

						} catch (error) {
							if (this.continueOnFail()) {
								// ...
							}
						}
					}

					return [returnData];
				}
			}`,
      errors: [
        {
          messageId: "changeThirdArgSameName",
        },
      ],
    },
    {
      code: outdent`
			class TestNode {
				async execute() {
					const items = this.getInputData();
					const returnData: INodeExecutionData[] = [];

					const resource = this.getNodeParameter('resource', 0) as string;
					const operation = this.getNodeParameter('operation', 0) as string;

					let responseData;

					for (let i = 0; i < items.length; i++) {

						try {
							
							if (resource === 'ticket') {

								if (operation === 'create') {

									responseData = await serviceApiRequest.call(this, 'POST', '/tickets', body);

									throw new NodeOperationError(this.getNode(), "Error!", { test: 123 });

								}

							}

						} catch (error) {
							if (this.continueOnFail()) {
								// ...
							}
						}
					}

					return [returnData];
				}
			}`,
      errors: [
        {
          messageId: "changeThirdArgDifferentName",
					data: { indexName: 'i' }
        },
      ],
    },
  ],
});
