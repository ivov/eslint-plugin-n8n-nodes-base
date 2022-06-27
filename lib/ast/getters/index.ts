import * as nodeParam from "./nodeParameter.getters";
import * as nodeClassDescription from "./nodeClassDescription.getters";
import * as credClassBody from "./credentialClassBody.getters";
import * as communityPackageJson from "./communityPackageJson.getters";

import * as common from "./common.getters";

export const getters = {
  nodeParam,
  nodeClassDescription,
  credClassBody,
  communityPackageJson,
  ...common,
};
