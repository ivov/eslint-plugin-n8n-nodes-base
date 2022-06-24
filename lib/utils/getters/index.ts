import * as nodeParam from "./nodeParam";
import * as nodeClassDescription from "./nodeClassDesc";
import * as credClassBody from "./credClassBody";
import * as packageJson from "./packageJson";

import * as className from "./_className";

export const getters = {
  nodeParam,
  nodeClassDescription,
  credClassBody,
  packageJson,
  ...className,
};
