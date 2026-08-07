import { PaisSelector } from "#/comun/componentes/pais/pais.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useCallback } from "react";
import { Presupuesto } from "../../diseño.ts";
import "./CambiarDireccionPresupuesto.css";

type DireccionPresupuesto = {
  tipo_via: string;
  nombre_via: string;
  numero: string;
  otros: string;
  cod_postal: string;
  apartado: string;
  ciudad: string;
  provincia: string;
  pais_id: string;
  telefono: string;
};

const metaDireccionPresupuesto: MetaModelo<DireccionPresupuesto> = {
  campos: {
    nombre_via: { requerido: true },
  },
};

export const CambiarDireccionPresupuesto = ({
  presupuesto,
  publicar,
  onCerrar,
}: {
  presupuesto: HookModelo<Presupuesto>;
  publicar: (evento: string, payload?: unknown) => void;
  onCerrar: () => void;
}) => {
  const { direccion, nombre_cliente, id_fiscal } = presupuesto.modelo.cliente;

  const { modelo, uiProps, valido } = useModelo(metaDireccionPresupuesto, {
    tipo_via: direccion.tipo_via ?? "",
    nombre_via: direccion.nombre_via ?? "",
    numero: direccion.numero ?? "",
    otros: direccion.otros ?? "",
    cod_postal: direccion.cod_postal ?? "",
    apartado: direccion.apartado ?? "",
    ciudad: direccion.ciudad ?? "",
    provincia: direccion.provincia ?? "",
    pais_id: direccion.pais_id ?? "",
    telefono: direccion.telefono ?? "",
  });

  const guardar_ = useCallback(async () => {
    publicar("cliente_cambiado", {
      cliente_id: "",
      nombre_cliente,
      id_fiscal,
      provincia_id: direccion.provincia_id,
      ...modelo,
    });
    onCerrar();
  }, [modelo, publicar, onCerrar, nombre_cliente, id_fiscal, direccion.provincia_id]);

  const [guardar, cancelar] = useForm(guardar_, onCerrar);

  return (
    <QModal
      abierto={true}
      nombre="cambiarDireccionPresupuesto"
      titulo="Dirección"
      onCerrar={cancelar}
    >
      <div className="CambiarDireccionPresupuesto">
        <quimera-formulario>
          <QInput label="Nombre de la Vía" {...uiProps("nombre_via")} />
          <QInput label="Tipo de Vía" {...uiProps("tipo_via")} />
          <QInput label="Número" {...uiProps("numero")} />
          <QInput label="Otros" {...uiProps("otros")} />
          <QInput label="Cód. Postal" {...uiProps("cod_postal")} />
          <QInput label="Ciudad" {...uiProps("ciudad")} />
          <QInput label="Provincia" {...uiProps("provincia")} />
          <PaisSelector label="País" {...uiProps("pais_id")} />
          <QInput label="Teléfono" {...uiProps("telefono")} />
        </quimera-formulario>
      </div>
      <div className="botones maestro-botones">
        <QBoton onClick={guardar} deshabilitado={!valido}>
          Guardar
        </QBoton>
      </div>
    </QModal>
  );
};
