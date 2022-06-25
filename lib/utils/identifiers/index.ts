import * as nodeParam from "./nodeParameter.identifiers";
import * as nodeClassDescription from "./nodeClassDescription.identifiers";
import * as credClassBody from "./credentialClassBody.identifiers";
import * as communityPackageJson from "./communityPackageJson.identifiers";

import * as lintableSections from "./lintable.identifiers";
import * as common from "./common.identifiers";

export const identifiers = {
  nodeParam,
  credClassBody,
  nodeClassDescription,
  ...communityPackageJson,
  ...lintableSections,
  ...common,
};
