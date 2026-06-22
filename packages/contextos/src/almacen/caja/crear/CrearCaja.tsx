import { Ubicacion } from "#/almacen/comun/componentes/Ubicacion.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/moleculas/qmodal.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useContext } from "react";
import { postCaja } from "../infraestructura.ts";
import { metaNuevaCaja, nuevaCajaVacia } from "./dominio.ts";

interface CrearCajaProps {
  publicar?: EmitirEvento;
  onCancelar?: () => void;
  activo?: boolean;
}

export const CrearCaja = ({
  publicar = async () => {},
  onCancelar = () => {},
  activo = false,
}: CrearCajaProps) => {
  const caja = useModelo(metaNuevaCaja, nuevaCajaVacia);
  const { intentar } = useContext(ContextoError);

  const guardar = async () => {
    const cajaNueva = { ...caja.modelo };
    const id = await intentar(() => postCaja(caja.modelo));
    cajaNueva.id = id;
    caja.init(nuevaCajaVacia);
    publicar("caja_creada", cajaNueva);
    onCancelar();
  };

  if (!activo) return null;

  return (
    <QModal
      abierto={activo}
      nombre="crear_caja"
      titulo="Nueva Caja"
      onCerrar={onCancelar}
    >
      <>
        <quimera-formulario>
          <QInput
            label="Código caja"
            autoSeleccion={true}
            {...caja.uiProps("id")}
          />
          <Ubicacion label="Ubicación" {...caja.uiProps("ubicacionId")} />
        </quimera-formulario>
        <div className="botones">
          <QBoton onClick={guardar} deshabilitado={!caja.valido}>
            Guardar
          </QBoton>
          <QBoton tipo="reset" variante="texto" onClick={onCancelar}>
            Cancelar
          </QBoton>
        </div>
      </>
    </QModal>
  );
};
