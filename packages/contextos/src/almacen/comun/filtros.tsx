import { MetaCampoFiltro } from "@olula/componentes/maestro/maestroFiltros/MaestroFiltrosActivoControlado.js";
import { Familia } from "./componentes/Familia.tsx";

export const filtroFamilia: MetaCampoFiltro = {
  id: "familia_id",
  label: "Familia",
  filtro: (v) => (v ? ["familia_id", "=", v as string] : null),
  render: (valor, onChange) => (
    <Familia
      valor={(valor as string) ?? ""}
      opcional
      onChange={(opcion) => onChange(opcion?.valor ?? "")}
    />
  ),
};
