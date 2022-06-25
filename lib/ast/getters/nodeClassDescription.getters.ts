import { TSESTree } from "@typescript-eslint/utils";
import { id } from "../identifiers";
import { restoreClassDescriptionOptions, restoreArray } from "../restorers";
import {
  getName as nodeParamGetName,
  getDisplayName as nodeParamGetDisplayName,
  getDescription as nodeParamGetDescription,
  getNumberProperty,
  getStringProperty,
} from "./nodeParameter.getters";

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
