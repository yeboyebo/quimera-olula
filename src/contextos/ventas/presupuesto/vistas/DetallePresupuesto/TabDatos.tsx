import { appFactory } from "../../../../../app.ts";
import { HookModelo } from "../../../../comun/useModelo.ts";
import { Presupuesto } from "../../diseño.ts";

interface TabDatosProps {
  presupuesto: HookModelo<Presupuesto>;
}

export const TabDatos = ({ presupuesto }: TabDatosProps) => {
  return appFactory().Ventas.PresupuestoTabDatos({
    presupuesto,
  });
};
