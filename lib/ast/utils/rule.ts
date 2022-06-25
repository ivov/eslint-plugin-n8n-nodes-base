/* eslint-disable import/no-extraneous-dependencies */

// @ts-ignore
import DocRuleTester from "eslint-docgen/src/rule-tester";
import { ESLintUtils } from "@typescript-eslint/utils";

export const createRule = ESLintUtils.RuleCreator((ruleName) => {
  return `https://github.com/ivov/eslint-plugin-n8n-nodes-base/blob/master/docs/rules/${ruleName}.md`;
});

export const getRuleName = ({ filename }: { filename: string }) =>
  filename
    .split("/")
    .pop()
    ?.replace(/(\.test)?\.(j|t)s/, "") ?? "Unknown";

export const ruleTester = () =>
  new DocRuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });
