import { useEffect, useState } from "react";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { QSelect } from "../../../../componentes/atomos/qselect.tsx";
import { Accion, EstadoObjetoValor } from "../../../comun/dominio.ts";
import { Presupuesto } from "../diseño.ts";
import { obtenerOpcionesSelector } from "../infraestructura.ts";

interface TabDatosProps {
  getProps: (campo: string) => Record<string, unknown>;
  setCampo: (campo: string) => (valor: unknown) => void;
  presupuesto: EstadoObjetoValor<Presupuesto>;
  dispatch: (action: Accion<Presupuesto>) => void;
  onEntidadActualizada: (entidad: Presupuesto) => void;
}

export const TabDatos = ({ getProps, setCampo }: TabDatosProps) => {
  const [opcionesDivisa, setOpcionesDivisa] = useState<
    { valor: string; descripcion: string }[]
  >([]);

  useEffect(() => {
    const cargarOpcionesDivisa = async () => {
      const opciones = await obtenerOpcionesSelector("divisa")();
      const opcionesMapeadas = opciones.map((opcion) => ({
        valor: opcion[0],
        descripcion: opcion[1],
      }));
      setOpcionesDivisa(opcionesMapeadas);
    };

    cargarOpcionesDivisa();
  }, []);

  return (
    <quimera-formulario>
      <QSelect
        label="Divisa"
        nombre="divisa_id"
        onChange={(opcion) => setCampo("divisa_id")(opcion?.valor)}
        opciones={opcionesDivisa}
        {...getProps("divisa_id")}
      />
      <QInput
        label="Agente"
        nombre="agente_id"
        onChange={setCampo("agente_id")}
        {...getProps("agente_id")}
      />
    </quimera-formulario>
  );
};
