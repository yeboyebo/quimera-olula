import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { Detalle } from "@olula/componentes/detalle/Detalle.tsx";
import { ContextoError } from "@olula/lib/contexto.ts";
import { EmitirEvento, Entidad } from "@olula/lib/diseño.ts";
import { procesarEvento } from "@olula/lib/dominio.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ArqueoTpv } from "../../diseño.ts";
import "./ArqueoTpv.css";
import { arqueoTpvVacio, ContextoArqueoTpv, EstadoArqueoTpv, metaArqueoTpv } from "./diseño.ts";
import { getMaquina } from "./maquina.ts";

const maquina = getMaquina();  

export const DetalleArqueoTpv = ({
    arqueoInicial = null,
    publicar = () => {},
}: {
    arqueoInicial?: ArqueoTpv | null;
    publicar?: EmitirEvento;
}) => {
    const params = useParams();
    const { intentar } = useContext(ContextoError);

    const [arqueoIdAnterior, setArqueoIdAnterior] = useState<string | null>(null);

    const [estado, setEstado] = useState<EstadoArqueoTpv>("INICIAL");
    // const [pagoActivo, setPagoActivo] = useState<PagoArqueoTpv | null>(null);

    const arqueoId = arqueoInicial?.id ?? params.id;
    const titulo = (arqueo: Entidad) => `Arqueo ${arqueo.id} estado: ${estado}`; 

    const arqueo = useModelo(metaArqueoTpv, arqueoTpvVacio);
    const { modelo, init } = arqueo;

    const emitir = useCallback(
        async (evento: string, payload?: unknown, inicial: boolean = false) => {

            const contexto: ContextoArqueoTpv = {
                estado: inicial ? 'INICIAL' : estado,
                arqueo: arqueo.modelo,
                arqueoInicial: arqueo.modeloInicial,
                // pagoActivo,
            }
            const [nuevoContexto, eventos] = await intentar(
                () => procesarEvento(maquina, contexto, evento, payload)
            );
            setEstado(nuevoContexto.estado);
            // setPagoActivo(nuevoContexto.pagoActivo);
            if (nuevoContexto.arqueo !== arqueo.modelo) {
                init(nuevoContexto.arqueo);
            }
            eventos.map((evento) => publicar(evento[0], evento[1]));
        },
        [arqueo, estado, setEstado, init, intentar, publicar]
    );

    const guardar = async () => {
        emitir("edicion_de_arqueo_lista", modelo);
    };

    const cancelar = () => {
        emitir("edicion_de_arqueo_cancelada");
    };

    // useEffect(() => {
    //     if (arqueoId && arqueoId !== arqueo.modelo.id) {
    //         emitir("id_arqueo_cambiado", arqueoId, true);
    //     }
    // }, [arqueoId, emitir, arqueo.modelo.id]);

    useEffect(() => {
        if (arqueoId && arqueoId !== arqueoIdAnterior) {
            setArqueoIdAnterior(arqueoId);
            emitir("id_arqueo_cambiado", arqueoId, true);
        }
    }, [arqueoId, arqueoIdAnterior, emitir]);

  
    return (
        <Detalle
            id={arqueoId}
            obtenerTitulo={titulo}
            setEntidad={() => {}}
            entidad={modelo}
            cerrarDetalle={()=> emitir("arqueo_deseleccionado", null, true)}
        >
        {!!arqueoId && (
            <div className="Detalle">
                { estado === "ABIERTO" && (
                    <div className="botones maestro-botones ">
                        <QBoton onClick={() => emitir("borrar_solicitado")}>
                            Borrar
                        </QBoton> 
                    </div>
                )}
                {/* <Tabs
                    children={[
                    <Tab
                        key="tab-1"
                        label="Cliente"
                        children={
                        <TabCliente arqueo={arqueo} publicar={emitir} />
                        }
                    />,
                    <Tab
                        key="tab-2"
                        label="Datos"
                        children={<TabDatos arqueo={arqueo} />}
                    />,
                    <Tab
                        key="tab-3"
                        label="Pagos"
                        children={
                            <Pagos pagoActivo={pagoActivo}
                                pagos={arqueo.modelo.pagos}
                                estado={estado}
                                publicar={emitir}
                            />
                        }
                    />,
                    ]}
                ></Tabs> */}
                {arqueo.modificado && (
                    <div className="botones maestro-botones ">
                    <QBoton onClick={guardar} deshabilitado={!arqueo.valido}>
                        Guardar
                    </QBoton>
                    <QBoton tipo="reset" variante="texto" onClick={cancelar}>
                        Cancelar
                    </QBoton>
                    </div>
                )}

                {/* <TotalesVenta
                    neto={Number(modelo.neto ?? 0)}
                    totalIva={Number(modelo.total_iva ?? 0)}
                    total={Number(modelo.total ?? 0)}
                    divisa={String(modelo.coddivisa ?? "EUR")}
                /> */}

                {/* {
                    estado === "BORRANDO_ARQUEO" &&
                    <BajaArqueoTpv
                        publicar={emitir}
                        arqueo = {modelo}
                    />
                }
                {
                    estado === "RECONTANDO" &&
                    <AltaPagoEfectivo
                        publicar={emitir}
                        arqueo={modelo}
                    />
                }
                {
                    estado === "CERRANDO" &&
                    <AltaPagoTarjeta
                        publicar={emitir}
                        arqueo={modelo}
                    />
                } */}
            </div>
        )}
        </Detalle>
    );
};
