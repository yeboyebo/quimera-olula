import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { useMaquina } from "@olula/componentes/hook/useMaquina.ts";
import { EmitirEvento } from "@olula/lib/diseño.ts";
import { listaEntidadesInicial } from "@olula/lib/ListaEntidades.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router";
import { BorrarCaja } from "../borrar/BorrarCaja.tsx";
import { MovimientoCaja } from "../diseño.ts";
import "./DetalleCaja.css";
import { cajaVacia, metaCaja } from "./dominio.ts";
import { LeerCodBarrasCaja } from "./LeerCodBarrasCaja.tsx";
import { getMaquina } from "./maquina.ts";
import { getMaquina as getMaquinaMovimientos } from "./movimientos/maquina.ts";
import { TabMovimientosLista } from "./movimientos/TabMovimientosLista.tsx";

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
      caja: cajaVacia,
      cajaInicial: cajaVacia,
    },
    publicar
  );

  const { ctx: ctxMovimientos, emitir: emitirMovimientos } = useMaquina(
    getMaquinaMovimientos,
    {
      estado: "lista",
      movimientos: listaEntidadesInicial<MovimientoCaja>(),
      cargando: true,
      cajaId: cajaId ?? "",
      formulario: {
        codBarras: "",
        cantidad: "1",
      },
    }
  );

  const caja = useModelo(metaCaja, ctx.caja);
  const { estado } = ctx;

  useEffect(() => {
    emitir("caja_id_cambiado", cajaId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cajaId]);

  useEffect(() => {
    if (!ctx.caja.id) return;
    void emitirMovimientos("caja_id_cambiada", ctx.caja.id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.caja.id]);

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
          <div className="DetalleCaja">
            <div className="transferencia-caja">
              <LeerCodBarrasCaja
                caja={ctx.caja}
                cajaId={ctx.caja.id}
                emitir={emitirMovimientos}
                formulario={ctxMovimientos.formulario}
              />
              <TabMovimientosLista
                cajaId={ctx.caja.id}
                movimientos={
                  ctxMovimientos.cajaId === ctx.caja.id
                    ? ctxMovimientos.movimientos.lista
                    : []
                }
                seleccionada={
                  ctxMovimientos.cajaId === ctx.caja.id
                    ? ctxMovimientos.movimientos.activo
                    : null
                }
                cargando={ctxMovimientos.cargando}
                emitir={emitirMovimientos}
              />
            </div>
          </div>
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
