import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router";
import { BorrarCaja } from "../borrar/BorrarCaja.tsx";
import { ArbolContenidoCaja } from "./ArbolContenidoCaja.tsx";
import "./DetalleCaja.css";
import { cajaContenidoVacia, metaCaja } from "./dominio.ts";
import { getMaquina } from "./maquina.ts";

const titulo = ({ id }: { id: string }) => ("Caja " + id) as string;

export const DetalleCaja = ({
  id,
  publicar = async () => {},
}: {
  id?: string;
  publicar?: EmitirEvento;
}) => {
  const params = useParams();
  const cajaId = id ?? params.id;

  const { ctx, emitir } = useMaquina(
    getMaquina,
    {
      estado: "INICIAL",
      caja: cajaContenidoVacia,
      cajaInicial: cajaContenidoVacia,
    },
    publicar
  );

  const caja = useModelo(metaCaja, ctx.caja);
  const { estado } = ctx;

  useEffect(() => {
    emitir("caja_id_cambiado", cajaId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cajaId]);

  const handleGuardar = useCallback(() => {
    emitir("edicion_de_caja_lista", caja.modelo);
  }, [emitir, caja]);

  const handleCancelar = useCallback(() => {
    emitir("edicion_de_caja_cancelada");
  }, [emitir]);

  if (!ctx.caja.id) return null;

  return (
    <Detalle
      id={ctx.caja.id}
      obtenerTitulo={titulo}
      setEntidad={() => {}}
      entidad={ctx.caja}
      cerrarDetalle={() => emitir("caja_deseleccionada", null)}
    >
      {!!ctx.caja.id && (
        <>
          <ArbolContenidoCaja contenido={ctx.caja.contenido} />
          {caja.modificado && (
            <div className="botones maestro-botones">
              <QBoton onClick={handleGuardar} deshabilitado={!caja.valido}>
                Guardar
              </QBoton>
              <QBoton
                tipo="reset"
                variante="texto"
                onClick={handleCancelar}
                deshabilitado={!caja.modificado}
              >
                Cancelar
              </QBoton>
            </div>
          )}
          <BorrarCaja
            activo={estado === "BORRANDO_CAJA"}
            caja={ctx.caja}
            publicar={emitir}
            onCancelar={() => emitir("borrado_cancelado")}
          />
        </>
      )}
    </Detalle>
  );
};
