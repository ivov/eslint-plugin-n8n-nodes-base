/**
 * Minimum number of options in an options-type or multi-options-type
 * node parameter that require alphabetization based on `name`.
 *
 * Also, minimum number of node params in a collection-type or
 * fixed-collection-type node param that require alphabetization
 * based on `displayName`.
 */
export const MIN_ITEMS_TO_ALPHABETIZE = 5;

export const MIN_ITEMS_TO_ALPHABETIZE_IN_FULL = "five";

export const WEAK_DESCRIPTIONS = [
  "Resource to consume",
  "Resource to operate on",
  "Operation to perform",
  "Action to perform",
  "Method of authentication",
];

export const SVG_ICON_SOURCES = [
  "https://vecta.io/symbols",
  "https://github.com/gilbarbara/logos",
];

export const RESOURCE_DESCRIPTION_SUFFIX = "Description.ts";

const EXPRESSIONS_DOCS_URL =
  "https://docs.n8n.io/nodes/expressions.html#expressions";

export const DYNAMIC_MULTI_OPTIONS_NODE_PARAMETER = {
  DISPLAY_NAME_SUFFIX: "Names or IDs",
  DESCRIPTION: `Choose from the list, or specify IDs using an <a href="${EXPRESSIONS_DOCS_URL}">expression</a>`,
};

export const DYNAMIC_OPTIONS_NODE_PARAMETER = {
  DISPLAY_NAME_SUFFIX: "Name or ID",
  DESCRIPTION: `Choose from the list, or specify an ID using an <a href="${EXPRESSIONS_DOCS_URL}">expression</a>`,
};

export const NODE_CLASS_DESCRIPTION_SUBTITLE =
  '={{ $parameter["operation"] + ": " + $parameter["resource"] }}';

export const LIMIT_NODE_PARAMETER = {
  DEFAULT_VALUE: 50,
  DESCRIPTION: "Max number of results to return",
};

export const UPSERT_NODE_PARAMETER = {
  DESCRIPTION:
    "Create a new record, or update the current one if it already exists (upsert)",
};

export const UPDATE_FIELDS_NODE_PARAM_DISPLAY_NAME = "Update Fields";

export const SIMPLIFY_NODE_PARAMETER = {
  DISPLAY_NAME: "Simplify",
  DESCRIPTION:
    "Whether to return a simplified version of the response instead of the raw data",
};

export const RETURN_ALL_NODE_PARAMETER = {
  DISPLAY_NAME: "Return All",
  DESCRIPTION: "Whether to return all results or only up to a given limit",
};

export const IGNORE_SSL_ISSUES_NODE_PARAMETER = {
  DISPLAY_NAME: "Ignore SSL Issues",
  DESCRIPTION:
    "Whether to connect even if SSL certificate validation is not possible",
};

export const TOP_LEVEL_FIXED_COLLECTION: {
  [key: Uppercase<string>]: { [key: Uppercase<string>]: string };
} = {
  STANDARD_DISPLAY_NAME: {
    CREATE: "Additional Fields",
    UPDATE: "Update Fields",
    GETALL: "Options",
  },
};

export const EMAIL_PLACEHOLDER = "name@email.com";

// ----------------------------------
//             regexes
// ----------------------------------

export const MISCASED_ID_REGEX = /\b(i|I)d(s?)\b/;

export const MISCASED_URL_REGEX = /\b(u|U)rl(s?)\b/;

export const MISCASED_JSON_REGEX = /\b(j|J)son\b/;

export const VALID_HTML_TAG_REGEX = /<\/?(h\d|p|b|em|i|a|ol|ul|li|code|br)>/;

export const LINE_BREAK_HTML_TAG_REGEX = /<\/? ?br ?\/?>/;

export const VERSION_REGEX = /^v\d+\.\d+$/;

// ----------------------------------
//       community package.json
// ----------------------------------

export const COMMUNITY_PACKAGE_JSON = {
  NAME: "n8n-nodes-starter",
  DESCRIPTION: "Example starter module for custom n8n nodes.",
  OFFICIAL_TAG: "n8n-community-node-package",
  LICENSE: "MIT",
  AUTHOR_NAME: "Jan Oberhauser",
  AUTHOR_EMAIL: "jan@n8n.io",
  REPOSITORY_URL: "git+https://github.com/n8n-io/n8n-nodes-starter.git",
  CREDENTIALS: [
    "dist/credentials/ExampleCredentials.credentials.js",
    "dist/credentials/HttpBinApi.credentials.js",
  ],
  NODES: [
    "dist/nodes/ExampleNode/ExampleNode.node.js",
    "dist/nodes/HttpBin/HttpBin.node.js",
  ],
  DEV_DEPENDENCIES: `{
    "@types/express": "^4.17.6",
    "@types/request-promise-native": "~1.0.15",
    "@typescript-eslint/parser": "^5.29.0",
    "eslint-plugin-n8n-nodes-base": "^1.0.43",
    "gulp": "^4.0.2",
    "jest": "^26.4.2",
    "n8n-workflow": "~0.104.0",
    "ts-jest": "^26.3.0",
    "tslint": "^6.1.2",
    "typescript": "~4.3.5"
  }`,
};

// ----------------------------------
//             docs
// ----------------------------------

export const DOCUMENTATION = {
  APPLICABLE_BY_EXTENSION_TO_NAME:
    "Applicable by extension to `name` in options-type or multi-options-type node parameter.",

  APPLICABLE_BY_EXTENSION_TO_DESCRIPTION_IN_OPTION:
    "Applicable by extension to `description` in option in options-type and multi-options-type node parameter.",
};
