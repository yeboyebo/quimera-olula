import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../../../../componentes/atomos/qboton.tsx";
import { Detalle } from "../../../../../../../componentes/detalle/Detalle.tsx";
import { Tab, Tabs } from "../../../../../../../componentes/detalle/tabs/Tabs.tsx";
import { QModalConfirmacion } from "../../../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { Entidad } from "../../../../../../../contextos/comun/diseño.ts";
import { useModelo } from "../../../../../../../contextos/comun/useModelo.ts";
import { Evento } from "../../diseño.ts";
import { eventoVacio, metaEvento } from "../../dominio.ts";
import { deleteEvento, getEvento, patchEvento } from "../../infraestructura.ts";
import { TabDatos } from "./TabDatos.tsx";
import { TabRuta } from "./TabRuta.tsx";

type Estado = "defecto";

export const DetalleEvento = () => {
  const params = useParams();
  const evento = useModelo(metaEvento, eventoVacio);
  const { modelo, init, modificado, valido } = evento;
    const [estado, setEstado] = useState<"confirmarBorrado" | "edicion">(
      "edicion"
    );
  const eventoId = params.id;
  const titulo = (evento: Entidad) => evento.descripcion as string;

  useEffect(() => {
    const fetchEventos = async () => {
      if (!eventoId) return;
      const eventoData = await getEvento(eventoId);
      init(eventoData);
    };
    fetchEventos();
  }, []);

  const onGuardarClicked = async () => {
    await patchEvento(modelo.id, modelo);
    const evento_guardado = await getEvento(modelo.id);
    init(evento_guardado);
    // emitir("EVENTO_CAMBIADO", evento_guardado);
  };

  const onBorrarConfirmado = async () => {
    await deleteEvento(modelo.id);
    // emitir("EVENTO_BORRADO", modelo);
    setEstado("edicion");
  };

  const onRecargarEvento = async () => {
    if (!eventoId) return;
    const eventoRecargado = await getEvento(eventoId);
    init(eventoRecargado);
    // emitir(EVENTO_CAMBIADO", eventoRecargado);
  };  

  const onImprimirHojaRutaClicked = async () => {
    console.log('mimensaje_onImprimirHojaRutaClicked');
  };  

  // console.log('mimensaje_aaaaaaaaaaa', evento);
  
  return (
    <div className="DetalleEvento">
      <Detalle
        id={eventoId}
        obtenerTitulo={titulo}
        setEntidad={(c) => init(c as Evento)}
        entidad={modelo}
        cargar={getEvento}
        className="detalle-evento"
        // cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
      >
        {!!eventoId && (
          <div className="DetalleEvento">
            <div className="maestro-botones ">
              <QBoton onClick={() => setEstado("confirmarBorrado")}>
                Borrar
              </QBoton>
              <QBoton onClick={() => onImprimirHojaRutaClicked}>
                Imprimir hoja de ruta
              </QBoton>              
            </div>
            <Tabs
              children={[
                <Tab
                  key="tab-1"
                  label="Datos"
                  children={
                    <TabDatos
                      evento={evento}
                      // emitirEvento={emitir}
                      recargarEvento={onRecargarEvento}
                    />
                  }
                />,
                <Tab
                  key="tab-1"
                  label="Hoja de ruta"
                  children={
                    <TabRuta evento={evento} 
                    // emitirEvento={emitir} 
                    />
                  }
                />,
                // <Tab
                //   key="tab-2"
                //   label="Direcciones"
                //   children={<TabDirecciones eventoId={eventoId} />}
                // />,
                // <Tab
                //   key="tab-3"
                //   label="Cuentas Bancarias"
                //   children={
                //     <TabCuentasBanco evento={evento} emitirEvento={emitir} />
                //   }
                // />,
                // <Tab
                //   key="tab-4"
                //   label="Agenda"
                //   children={
                //     <div className="detalle-evento-tab-contenido">
                //       <TabCrmContactos eventoId={eventoId} />
                //     </div>
                //   }
                // />,
              ]}
            />
            {evento.modificado && (
              <div className="maestro-botones ">
                <QBoton onClick={onGuardarClicked} deshabilitado={!valido}>
                  Guardar
                </QBoton>
                <QBoton
                  tipo="reset"
                  variante="texto"
                  onClick={() => init()}
                  deshabilitado={!modificado}
                >
                  Cancelar
                </QBoton>
              </div>
            )}
            <QModalConfirmacion
              nombre="borrarEvento"
              abierto={estado === "confirmarBorrado"}
              titulo="Confirmar borrar"
              mensaje="¿Está seguro de que desea borrar este evento?"
              onCerrar={() => setEstado("edicion")}
              onAceptar={onBorrarConfirmado}
            />
          </div>
        )}
      </Detalle>
    </div>
  );
};