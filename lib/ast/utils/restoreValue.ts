export function restoreValue<T>(source: string): T | null {
	try {
		return eval(`(${source})`);
	} catch (error) {
		return null;
	}
}
