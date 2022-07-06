import rule from "../lib/rules/node-execute-block-operation-missing-singular-pairing";
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

									returnData.push({
										json: responseData,
										pairedItem: {
											item: i,
										},
									});

								} else if (operation === 'getAll') {

									responseData = await serviceApiRequest.call(this, 'GET', '/tickets', body);

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

								} else if (operation === 'getAll') {

									responseData = await serviceApiRequest.call(this, 'GET', '/tickets', body);

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
      errors: [{ messageId: "missingSingularPairing" }],
		}
  ],
});
