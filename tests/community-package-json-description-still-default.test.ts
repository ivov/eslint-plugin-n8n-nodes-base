import rule from "../lib/rules/community-package-json-description-still-default";
import { ruleTester, getRuleName } from "../lib/utils";
import outdent from "outdent";

ruleTester().run(getRuleName(module), rule, {
  valid: [
    {
      code: outdent`
			const packageJson = {
				"name": "n8n-nodes-service",
				"version": "0.1.1",
				"description": "Consumes Service API",
				"license": "MIT",
				"author": {
						"name": "John Smith",
						"email": "john.smith@mail.com"
				},
				"repository": {
						"type": "git",
						"url": "git+https://github.com/johnsmith/n8n-nodes-service.git"
				},
				"keywords": [
						"n8n-community-node-package"
				],
				"main": "index.js",
				"scripts": {
						"dev": "npm run watch",
						"build": "tsc && gulp",
						"lint": "tslint -p tsconfig.json -c tslint.json",
						"lintfix": "tslint --fix -p tsconfig.json -c tslint.json",
						"nodelinter": "nodelinter",
						"watch": "tsc --watch",
						"test": "jest"
				},
				"files": [
						"dist"
				],
				"n8n": {
						"credentials": [
								"dist/credentials/ServiceApi.credentials.js"
						],
						"nodes": [
								"dist/nodes/Service/Service.node.js"
						]
				},
				"devDependencies": {
						"@types/express": "^4.17.6",
						"@types/jest": "^26.0.13",
						"@types/node": "^14.17.27",
						"@types/request-promise-native": "~1.0.15",
						"gulp": "^4.0.0",
						"jest": "^26.4.2",
						"n8n-workflow": "~0.83.0",
						"nodelinter": "^0.1.9",
						"ts-jest": "^26.3.0",
						"tslint": "^6.1.2",
						"typescript": "~4.3.5"
				},
				"dependencies": {
						"n8n-core": "~0.101.0"
				}
			}`,
    },
  ],
  invalid: [
    {
      code: outdent`
			const packageJson = {
				"name": "n8n-nodes-starter",
				"version": "0.1.1",
				"description": "Example starter module for custom n8n nodes.",
				"license": "MIT",
				"author": {
						"name": "John Smith",
						"email": "john.smith@mail.com"
				},
				"repository": {
						"type": "git",
						"url": "git+https://github.com/johnsmith/n8n-nodes-service.git"
				},
				"keywords": [
						"n8n-community-node-package"
				],
				"main": "index.js",
				"scripts": {
						"dev": "npm run watch",
						"build": "tsc && gulp",
						"lint": "tslint -p tsconfig.json -c tslint.json",
						"lintfix": "tslint --fix -p tsconfig.json -c tslint.json",
						"nodelinter": "nodelinter",
						"watch": "tsc --watch",
						"test": "jest"
				},
				"files": [
						"dist"
				],
				"n8n": {
						"credentials": [
								"dist/credentials/ServiceApi.credentials.js"
						],
						"nodes": [
								"dist/nodes/Service/Service.node.js"
						]
				},
				"devDependencies": {
						"@types/express": "^4.17.6",
						"@types/jest": "^26.0.13",
						"@types/node": "^14.17.27",
						"@types/request-promise-native": "~1.0.15",
						"gulp": "^4.0.0",
						"jest": "^26.4.2",
						"n8n-workflow": "~0.83.0",
						"nodelinter": "^0.1.9",
						"ts-jest": "^26.3.0",
						"tslint": "^6.1.2",
						"typescript": "~4.3.5"
				},
				"dependencies": {
						"n8n-core": "~0.101.0"
				}
			}`,
      errors: [{ messageId: "updateDescription" }],
    },
  ],
});
