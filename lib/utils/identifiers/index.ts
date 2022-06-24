import * as nodeParam from "./nodeParam";
import * as nodeClassDescription from "./nodeClassDesc";
import * as credClassBody from "./credClassBody";
import * as communityPackageJson from "./communityPackageJson";

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
