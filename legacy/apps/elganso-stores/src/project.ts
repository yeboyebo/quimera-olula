import core from "@quimera-extension/core";
import stores from "@quimera-extension/elganso-stores";
import login from "@quimera-extension/login";
import { mainTheme } from "quimera";

export default {
  path: "apps/elganso-stores",
  dependencies: [core, login, stores],
  theme: mainTheme,
};
