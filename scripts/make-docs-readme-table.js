"use strict";

// make rules table for README.md

const outdent = require("outdent");
const fs = require("fs");
const path = require("path");
const { AUTOFIXABLE_UNSAFE_RULESET } = require("../index");

const rulesPath = path.join(__dirname, "..", "dist", "lib", "rules");

const allRuleNames = fs
  .readdirSync(rulesPath)
  .filter((fileName) => fileName.endsWith(".js"))
  .map((fileName) => fileName.replace(/\.js$/, ""));

updateMarkedSegment("./README.md", makeRulesTable(), {
  start: "<!-- RULES_TABLE -->",
  end: "<!-- /RULES_TABLE -->",
});

async function updateMarkedSegment(filepath, updateText, mark) {
  const oldContent = await fs.promises.readFile(filepath, "utf8");
  const newContent = replaceInsideMarkedSegment(oldContent, updateText, mark);

  if (newContent === oldContent) return;

  fs.writeFileSync(filepath, newContent);
}

function replaceInsideMarkedSegment(original, updateText, mark) {
  const startMarkIndex = original.indexOf(mark.start);
  const endMarkIndex = original.indexOf(mark.end);

  if (!updateText) {
    throw new Error("Update text is required.");
  }

  if (!mark) {
    throw new Error("Segment mark is required.");
  }

  if (startMarkIndex === -1) {
    throw new Error(`Failed to find ${mark.start}' in file ${original}.`);
  }

  if (endMarkIndex === -1) {
    throw new Error(`Failed to find ${mark.end}' in file.`);
  }

  if (startMarkIndex > endMarkIndex) {
    throw new Error(`Use '${mark.start}' before '${mark.end}'.`);
  }

  const before = original.slice(0, startMarkIndex + mark.start.length);
  const after = original.slice(endMarkIndex);

  return before + `\n${updateText}\n` + after;
}

function makeRulesTable() {
  const rules = allRuleNames.map((ruleName) => {
    const rule = require(path.join(rulesPath, ruleName)).default;

    return {
      id: ruleName,
      meta: rule.meta,
      isAutofixable: rule.meta.fixable !== undefined,
      isAutofixableUnsafe: AUTOFIXABLE_UNSAFE_RULESET.includes(ruleName),
    };
  });

  const rulesTableContent = rules
    .map((rule) => {
      const url = `docs/rules/${rule.id}.md`;
      const link = `[${rule.id}](${url})`;

      const { description } = rule.meta.docs;

      return `| ${[
        link,
        description,
        rule.isAutofixableUnsafe
          ? "Yes, unsafe"
          : rule.isAutofixable
          ? "Yes, safe"
          : "No",
      ].join(" | ")} |`;
    })
    .join("\n");

  return outdent`
		| Name${"&nbsp;".repeat(40)} | Description | Autofixable |
		|${" :-- |".repeat(3)}
		${rulesTableContent}
	`;
}
