import rule from "../lib/rules/community-package-json-n8n-api-version-not-number";
import { ruleTester, getRuleName } from "../lib/ast";
import outdent from "outdent";
import { COMMUNITY_PACKAGE_JSON } from "../lib/constants";

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
						"${COMMUNITY_PACKAGE_JSON.OFFICIAL_TAG}"
				],
				"main": "index.js",
				"scripts": ${COMMUNITY_PACKAGE_JSON.SCRIPTS},
				"files": [
						"dist"
				],
				"n8n": {
						"n8nNodesApiVersion": 1,
						"credentials": [
								"dist/credentials/ServiceApi.credentials.js"
						],
						"nodes": [
								"dist/nodes/Service/Service.node.js"
						]
				},
				"devDependencies": ${COMMUNITY_PACKAGE_JSON.DEV_DEPENDENCIES},
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
						"${COMMUNITY_PACKAGE_JSON.OFFICIAL_TAG}"
				],
				"main": "index.js",
				"scripts": ${COMMUNITY_PACKAGE_JSON.SCRIPTS},
				"files": [
						"dist"
				],
				"n8n": {
						"n8nNodesApiVersion": "1",
						"credentials": [
								"dist/credentials/ServiceApi.credentials.js"
						],
						"nodes": [
								"dist/nodes/Service/Service.node.js"
						]
				},
				"devDependencies": ${COMMUNITY_PACKAGE_JSON.DEV_DEPENDENCIES},
				"dependencies": {
						"n8n-core": "~0.101.0"
				}
			}`,
			errors: [{ messageId: "changeToNumber" }],
		},
	],
});
