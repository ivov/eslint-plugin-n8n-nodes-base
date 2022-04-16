"use strict";

// make docs for untested rules

const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const ruleModules = require("../dist/index").rules;

const rulesPath = path.join(__dirname, "..", "dist", "lib", "rules");
const testsPath = path.join(__dirname, "..", "tests");
const untestedTemplatePath = path.join(
  __dirname,
  "..",
  "templates",
  "_untested.ejs"
);

const allRuleNames = fs
  .readdirSync(rulesPath)
  .filter((fileName) => fileName.endsWith(".js"))
  .map((fileName) => fileName.replace(/\.js$/, ""));

const allTestNames = fs
  .readdirSync(testsPath)
  .filter((fileName) => fileName.endsWith(".test.ts"))
  .map((fileName) => fileName.replace(/\.test\.ts$/, ""));

const untestedRules = allRuleNames.filter((r) => !allTestNames.includes(r));

const untestedRuleModules = Object.entries(ruleModules).reduce(
  (acc, [ruleName, ruleContent]) => {
    if (untestedRules.includes(ruleName)) acc[ruleName] = ruleContent;
    return acc;
  },
  {}
);

for (const [ruleName, ruleContent] of Object.entries(untestedRuleModules)) {
  const templateArgs = {
    title: ruleName,
    description: ruleContent.meta.docs.description,
    linkRule: `/lib/rules/${ruleName}`,
    linkTest: undefined,
    linkDoc: undefined,
    pluginName: "eslint-plugin-n8n-nodes-base",
    inConfigs: [
      {
        config: "non-autofixable",
      },
    ],
  };

  ejs.renderFile(untestedTemplatePath, templateArgs, {}, (error, output) => {
    if (error) {
      console.log(error);
      process.exit(1);
    }
    fs.writeFileSync(
      `${__dirname}/../docs/rules/${templateArgs.title}.md`,
      output
    );
  });
}
