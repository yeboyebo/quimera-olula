import almacen from "@quimera-extension/base-almacen";
import ventas from "@quimera-extension/base-ventas";
import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import sanhigiaDevolPed from "@quimera-extension/sanhigia-devol_pedidos";
import smartsales from "@quimera-extension/sanhigia-smartsales";

import sanhigiaTheme from "./theme";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const project: any = {
  path: "projects/sanhigia",
  dependencies: [core, login, almacen, ventas, sanhigiaDevolPed, smartsales],
  theme: sanhigiaTheme,
};

export default project;
