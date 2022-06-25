import * as nodeParam from "./nodeParam";
import * as nodeClassDescription from "./nodeClassDesc";
import * as credClassBody from "./credClassBody";
import * as communityPackageJson from "./communityPackageJson";

import * as className from "./_className";

export const getters = {
  nodeParam,
  nodeClassDescription,
  credClassBody,
  communityPackageJson,
  ...className,
};
