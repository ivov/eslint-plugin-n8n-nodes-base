const isTestRun = process.env.NODE_ENV === "test";

export function getNodeFilename(fullPath: string) {
  if (isTestRun) return "Test.node.ts";

  const filename = fullPath.split("/").pop();

  if (!filename) {
    throw new Error(`Failed to extract node filename from path: ${fullPath}`);
  }

  return filename;
}

export function isCredentialFile(fullPath: string) {
  if (isTestRun) return true;

  return getNodeFilename(fullPath).endsWith(".credentials.ts");
}

export function isNodeFile(fullPath: string) {
  if (isTestRun) return true;

  return getNodeFilename(fullPath).endsWith(".node.ts");
}

export function isRegularNodeFile(filePath: string) {
  if (isTestRun) return true;

  const filename = getNodeFilename(filePath);

  return (
    filename.endsWith(".node.ts") &&
    !filename.endsWith("Trigger.node.ts") &&
    !filename.endsWith("EmailReadImap.node.ts") // trigger node without trigger in the name
  );
}

export function isTriggerNodeFile(filePath: string) {
  if (isTestRun) return true;

  return getNodeFilename(filePath).endsWith("Trigger.node.ts");
}

export function isCredClassFile(filePath: string) {
  if (isTestRun) return true;

  return getNodeFilename(filePath).endsWith(".credentials.ts");
}

export function toExpectedNodeFilename(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1) + ".node.ts";
}