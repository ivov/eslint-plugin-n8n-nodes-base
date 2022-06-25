import { TSESTree } from "@typescript-eslint/utils";
import { identifiers as id } from "../identifiers";
import { restoreClassDescriptionOptions, restoreArray } from "./_restore";
import {
  getName as nodeParamGetName,
  getDisplayName as nodeParamGetDisplayName,
  getDescription as nodeParamGetDescription,
  getNumberProperty,
  getStringProperty,
} from "./nodeParam";

export function getCredOptions(nodeParam: TSESTree.ObjectExpression) {
  const found = nodeParam.properties.find(
    id.nodeClassDescription.isCredentials
  );

  if (!found) return null;

  return {
    ast: found,
    value: restoreClassDescriptionOptions(found.value.elements),
  };
}

export function getInputs(nodeParam: TSESTree.ObjectExpression) {
  const found = nodeParam.properties.find(id.nodeClassDescription.isInputs);

  if (!found) return null;

  return {
    ast: found,
    value: restoreArray(found.value.elements),
  };
}

export function getOutputs(nodeParam: TSESTree.ObjectExpression) {
  const found = nodeParam.properties.find(id.nodeClassDescription.isOutputs);

  if (!found) return null;

  return {
    ast: found,
    value: restoreArray(found.value.elements),
  };
}

export function getSubtitle(nodeParam: TSESTree.ObjectExpression) {
  const found = nodeParam.properties.find(id.nodeClassDescription.isSubtitle);

  if (!found) return null;

  return {
    ast: found,
    value: found.value.value,
  };
}

export function getAllDisplayNames(nodeParam: TSESTree.ObjectExpression) {
  const properties = nodeParam.properties.find(
    id.nodeClassDescription.isProperties
  );

  if (!properties) return null;

  const displayNames = properties.value.elements.reduce<string[]>(
    (acc, element) => {
      const found = element.properties?.find(id.nodeParam.isDisplayName);

      if (found) acc.push(found.value.value);

      return acc;
    },
    []
  );

  if (!displayNames.length) return null;

  return displayNames;
}

export const getName = nodeParamGetName; // synonym for consistency

export const getDisplayName = nodeParamGetDisplayName; // synonym for consistency

export const getDescription = nodeParamGetDescription; // synonym for consistency

export function getVersion(nodeParam: TSESTree.ObjectExpression) {
  return getNumberProperty(id.nodeClassDescription.isVersion, nodeParam);
}

export function getDefaultVersion(nodeParam: TSESTree.ObjectExpression) {
  return getNumberProperty(id.nodeClassDescription.isDefaultVersion, nodeParam);
}

export function getIcon(nodeParam: TSESTree.ObjectExpression) {
  return getStringProperty(id.nodeClassDescription.isIcon, nodeParam);
}
