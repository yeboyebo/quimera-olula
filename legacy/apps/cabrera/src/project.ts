import core from "@quimera-extension/core";
import login from "@quimera-extension/login";
import vbarbaAlmacen from "@quimera-extension/vbarba-almacen";
import vbarbaFacturacion from "@quimera-extension/vbarba-facturacion";
import vbarbaFirmaAlb from "@quimera-extension/vbarba-firma_albaranes";
import vbarbaTheme from "./theme.js";


export default {
  path: "apps/cabrera",
  dependencies: [core, login, vbarbaFirmaAlb, vbarbaFacturacion, vbarbaAlmacen],
  theme: vbarbaTheme,
} as unknown;
