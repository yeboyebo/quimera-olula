import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import MrelaxAreaClientes from "@quimera-extension/monterelax-area_clientes";

import MrelaxTheme from "./theme";

export default {
  path: "projects/monterelax",
  dependencies: [core, login, MrelaxAreaClientes],
  theme: MrelaxTheme,
} as unknown;