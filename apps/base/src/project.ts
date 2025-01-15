import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import { mainTheme } from "quimera";

import newaarch from "@quimera-extension/examples-new_arch";

export default {
  path: "projects/base",
  dependencies: [core, login, newaarch],
  theme: mainTheme,
};
