import * as nodeParam from "./nodeParameter.identifiers";
import * as nodeClassDescription from "./nodeClassDescription.identifiers";
import * as credClassBody from "./credentialClassBody.identifiers";
import * as communityPackageJson from "./communityPackageJson.identifiers";

import * as lintableSections from "./_lintableSections";
import * as typedProps from "./_typedProps";
import * as credClass from "./_credClass";
import * as namedValue from "./_namedValue";

export const identifiers = {
  nodeParam,
  credClassBody,
  nodeClassDescription,
  ...communityPackageJson,
  ...lintableSections,
  ...typedProps,
  ...credClass,
  ...namedValue,
};
