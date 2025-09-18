import { useContext, useState } from "react";
import { useParams } from "react-router";
import { QBoton } from "../../../../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../../../../componentes/atomos/qinput.tsx";
import { Detalle } from "../../../../../../../componentes/detalle/Detalle.tsx";
import { QModalConfirmacion } from "../../../../../../../componentes/moleculas/qmodalconfirmacion.tsx";
import { ContextoError } from "../../../../../../../contextos/comun/contexto.ts";
import { Entidad } from "../../../../../../../contextos/comun/diseño.ts";
import { useModelo } from "../../../../../../../contextos/comun/useModelo.ts";
import { deleteTrabajador, getTrabajador, patchTrabajador } from "../../../trabajador/infraestructura.ts";
import { Trabajador } from "../../diseño.ts";
import { metaTrabajador, trabajadorVacio } from "../../dominio.ts";

export const DetalleTrabajador = ({
  trabajadorInicial = null,
  emitir = () => {},
}: {
  trabajadorInicial?: Trabajador | null;
  emitir?: (trabajador: string, payload?: unknown) => void;
}) => {
  const params = useParams();
  const trabajadorId = trabajadorInicial?.id ?? params.id;
  const titulo = (trabajador: Entidad) => `Trabajador (${trabajador.id})` as string;
  const { intentar } = useContext(ContextoError);

  const trabajador = useModelo(metaTrabajador, trabajadorVacio);
  const { modelo, init, modificado, valido } = trabajador;
    const [estado, setEstado] = useState<"confirmarBorrado" | "edicion">(
    "edicion"
  );    

  // const maquina: Maquina<Estado> = {
  //   defecto: {
  //     GUARDAR_INICIADO: async () => {
  //       console.log("hola mundo");
  //     },
  //   },
  // };
  // const emitirTrabajador = useMaquina(maquina, "defecto", () => {});

  const onGuardarClicked = async () => {
    await intentar(() => patchTrabajador(modelo.id, modelo));
    const trabajador_guardado = await getTrabajador(modelo.id);
    init(trabajador_guardado);
    emitir("TRABAJADOR_CAMBIADO", trabajador_guardado);
  };

  const onBorrarConfirmado = async () => {
    await intentar(() => deleteTrabajador(modelo.id));
    emitir("TRABAJADOR_BORRADO", modelo);
    setEstado("edicion");
  };  

  
  return (
    <Detalle
      id={trabajadorId}
      obtenerTitulo={titulo}
      setEntidad={(o) => init(o)}
      entidad={modelo}
      cargar={getTrabajador}
      cerrarDetalle={() => emitir("CANCELAR_SELECCION")}
    >
      {!!trabajadorId && (
        <div className="DetalleTrabajador">
          <div className="maestro-botones ">
            <QBoton onClick={() => setEstado("confirmarBorrado")}>
              Borrar
            </QBoton>
          </div>
          <quimera-formulario>
            <QInput label="Nombre" {...trabajador.uiProps("nombre")} />
            <QInput label="Coste/Hora" {...trabajador.uiProps("coste")} />
          </quimera-formulario>
        </div>
      )}
      {trabajador.modificado && (
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
        nombre="borrarTrabajador"
        abierto={estado === "confirmarBorrado"}
        titulo="Confirmar borrar"
        mensaje="¿Está seguro de que desea borrar este trabajador?"
        onCerrar={() => setEstado("edicion")}
        onAceptar={onBorrarConfirmado}
      />        
    </Detalle>
  );
};