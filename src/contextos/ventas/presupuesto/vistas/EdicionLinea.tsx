import { QBoton } from "../../../../componentes/atomos/qboton.tsx";
import { QInput } from "../../../../componentes/atomos/qinput.tsx";
import { useModelo } from "../../../comun/useModelo.ts";
import { LineaPresupuesto } from "../diseño.ts";
import { metaLinea } from "../dominio.ts";

export const EdicionLinea = ({
  lineaInicial,
  publicar,
}: {
  lineaInicial: LineaPresupuesto
  publicar: (evento: string, payload: unknown) => void;
}) => {
//   presupuestoId,
//   linea,
//   onLineaActualizada,
//   onCancelar,
// }: {
//   presupuestoId: string;
//   linea: Linea;
//   onLineaActualizada: (linea: Linea) => void;
//   onCancelar: () => void;
// }) => {
  // const [estado, setEstado] = useState({} as Record<string, string>);
  const {modelo, uiProps, valido} = useModelo(metaLinea, lineaInicial);
  // useEffect(() => {
  //   init(lineaInicial);
  // }, [lineaInicial, init]);
  console.log('linea', lineaInicial, modelo);

  // const onGuardar = async (datos: Record<string, string>) => {
  //   const nuevoEstado = {
  //     referencia:
  //       datos.referencia.trim() === "" ? "La referencia es obligatoria." : "",
  //   };

  //   setEstado(nuevoEstado);

  //   if (Object.values(nuevoEstado).some((v) => v.length > 0)) return;

  //   await patchArticuloLinea(presupuestoId, linea.id, datos.referencia);
  //   const lineaActualizada = { ...linea, referencia: datos.referencia };
  //   onLineaActualizada(lineaActualizada);
  // };

  return (
    // <>
    //   <h2>Edición de línea</h2>
    //   <QForm onSubmit={onGuardar} onReset={onCancelar}>
    //     <section>
    //       <QInput
    //         label="Referencia"
    //         nombre="referencia"
    //         valor={linea.referencia}
    //         erroneo={!!estado.referencia && estado.referencia.length > 0}
    //         textoValidacion={estado.referencia}
    //       />
    //     </section>
    //     <section>
    //       <QBoton tipo="submit">Guardar</QBoton>
    //       <QBoton tipo="reset" variante="texto">
    //         Cancelar
    //       </QBoton>
    //     </section>
    //   </QForm>
    // </>
    <>
      <h2>Edición de línea</h2>
      <quimera-formulario>
        <QInput
          label='Referencia'
          {...uiProps("referencia")}
        />
        <QInput
          label='Cantidad'
          {...uiProps("cantidad")}
        />
      </quimera-formulario>
      <div className="botones maestro-botones ">
        <QBoton
          onClick={() => publicar('linea_edicion_lista', modelo)}
          deshabilitado={!valido}
        >
          Guardar
        </QBoton>
      </div>
    </>
  );
};
