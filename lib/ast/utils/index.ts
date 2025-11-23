import * as filename from "./filename";
import * as format from "./format";
import * as insertion from "./insertion";
import * as range from "./range";
import * as resolveValue from "./resolveValue";
import * as restoreValue from "./restoreValue";
import * as rule from "./rule";
import * as sort from "./sort";

export const utils = {
	...filename,
	...format,
	...insertion,
	...range,
	...resolveValue,
	...restoreValue,
	...rule,
	...sort,
};
