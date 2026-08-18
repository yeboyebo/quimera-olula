import { CamposDireccion } from "#/ventas/comun/componentes/CamposDireccion.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { MetaModelo } from "@olula/lib/dominio.ts";
import { useForm } from "@olula/lib/useForm.ts";
import { HookModelo, useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo } from "react";
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

  const direccionInicial = useMemo(
    () => ({
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
    }),
    [
      direccion.tipo_via,
      direccion.nombre_via,
      direccion.numero,
      direccion.otros,
      direccion.cod_postal,
      direccion.apartado,
      direccion.ciudad,
      direccion.provincia,
      direccion.pais_id,
      direccion.telefono,
    ]
  );

  const { modelo, uiProps, valido } = useModelo(
    metaDireccionPresupuesto,
    direccionInicial
  );

  const guardar_ = useCallback(async () => {
    publicar("cliente_cambiado", {
      cliente_id: "",
      nombre_cliente,
      id_fiscal,
      ...modelo,
    });
    onCerrar();
  }, [modelo, publicar, onCerrar, nombre_cliente, id_fiscal]);

  const [guardar, cancelar] = useForm(guardar_, onCerrar);

  return (
    <QModal
      abierto={true}
      nombre="cambiarDireccionPresupuesto"
      titulo="Dirección"
      onCerrar={cancelar}
    >
      <div className="CambiarDireccionPresupuesto campos-direccion">
        <quimera-formulario>
          <CamposDireccion uiProps={uiProps} />
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
