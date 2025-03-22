import { useContext, useState } from "react";
import { useParams } from "react-router";
import estilos from "../../../../componentes/detalle/detalle.module.css";
import { Detalle } from "../../../../componentes/detalle/Detalle.tsx";
import { Input } from "../../../../componentes/detalle/FormularioGenerico.tsx";
import { Tab, Tabs } from "../../../../componentes/detalle/tabs/Tabs.tsx";
import { Entidad } from "../../../comun/diseño.ts";
import { guardar } from "../../cliente/dominio.ts";
import { Contexto } from "../contexto.ts";
import {
  Presupuesto
} from "../diseño.ts";
import { presupuestoVacio } from "../dominio.ts";
import {
  camposPresupuesto,
  getPresupuesto
} from "../infraestructura.ts";

// interface DetallePresupuestoProps {
//   id: string | null;
//   acciones: Acciones<Presupuesto>;
//   obtenerTitulo?: (entidad: Presupuesto) => string;
// }

export const DetallePresupuesto = (
  {
    onEntidadActualizada,
  }: {
    onEntidadActualizada: (entidad: Presupuesto) => void;
  }
) => {
  const { detalle } = estilos;

  const params = useParams();

  const context = useContext(Contexto);
  if (!context) {
    return null;
  }
  const { seleccionada } = context;
  
  const [guardando, setGuardando] = useState(false);
  
  const presupuestoId = seleccionada?.id ?? params.id;

  const sufijoTitulo = guardando ? " (Guardando...)" : "";
  const titulo = (presupuesto: Entidad) => `${presupuesto.codigo} ${sufijoTitulo}` as string;

  const [presupuesto, setPresupuesto] = useState<Presupuesto>(presupuestoVacio());

  const onCampoCambiado = async (campo: string, valor: any) => {
      setGuardando(true);
      if (presupuestoId) {
        await guardar(presupuestoId,{
          [campo]: valor
        })
      }
      setGuardando(false);
      const nuevoPresupuesto: Presupuesto = { ...presupuesto, [campo]: valor };
      setPresupuesto(nuevoPresupuesto);
      onEntidadActualizada && onEntidadActualizada(nuevoPresupuesto);
    };

  // useEffect(() => {
  //   if (id && id !== "") {
  //     obtenerUno(id)
  //       .then((entidad) => {
  //         setEntidad(entidad as Presupuesto);
  //       })
  //       .catch(() => {
  //         setEntidad({} as Presupuesto);
  //       });
  //   }
  // }, [id, obtenerUno]);

  // if (!id) {
  //   return <></>;
  // }
  // if (!entidad) {
  //   return <>No se ha encontrado el presupuesto</>;
  // }

  // const onCambiarCantidadLinea = async (
  //   id: string,
  //   linea: LineaPresupuesto
  // ) => {
  //   if (entidad) {
  //     const objCambioLinea = {
  //       lineas: [{ linea_id: id, cantidad: linea.cantidad }],
  //     };
  //     accionesPresupuesto
  //       .actualizarUnElemento(
  //         entidad.id,
  //         objCambioLinea,
  //         "cambiar_cantidad_lineas"
  //       )
  //       .then(() => {
  //         accionesPresupuesto.obtenerUno(entidad.id).then((presupuesto) => {
  //           if (presupuesto) {
  //             setEntidad(presupuesto as Presupuesto);
  //             //   setEntidades(
  //             //     entidades.map((entidad) => {
  //             //       if (entidad.id === presupuesto.id) {
  //             //         return presupuesto;
  //             //       }
  //             //       return entidad;
  //             //     })
  //             //   );
  //           }
  //         });
  //       })
  //       .catch((error) => {
  //         console.error("Error al actualizar la línea de presupuesto:", error);
  //       });
  //   } else {
  //     console.error("Error: no hay entidad");
  //   }
  // };

  // const accionesLineasPresupuesto: AccionesLineaPresupuesto = {
  //   ...crearAccionesRelacionadas("presupuesto", "linea", presupuesto?.id || "0"),
  //   onCambiarCantidadLinea,
  // };

  // const actualizar = (data: Presupuesto) =>
  //   accionesPresupuesto.actualizarUno(id, data).then(() => {
  //     setEntidad(data as Presupuesto);
  //   });


  return (
    <div className={detalle}>
      <Detalle
        id={presupuestoId ?? "0"}
        obtenerTitulo={titulo}
        setEntidad={(p) => setPresupuesto(p as Presupuesto)}
        entidad={presupuesto}
        cargar={getPresupuesto}
      >
        <Tabs
          children={[
            <Tab
              key="tab-1"
              label="Cliente"
              children={
                <>
                  <Input
                      controlado={false}            
                      campo={camposPresupuesto.codigo}
                      onCampoCambiado={onCampoCambiado}
                      valorEntidad={presupuesto.codigo}
                  />
                  <Input
                      controlado={false}            
                      campo={camposPresupuesto.cliente_id}
                      onCampoCambiado={onCampoCambiado}
                      valorEntidad={presupuesto.cliente_id}
                  />
                  <Input
                      controlado={false}            
                      campo={camposPresupuesto.nombre_cliente}
                      onCampoCambiado={onCampoCambiado}
                      valorEntidad={presupuesto.nombre_cliente}
                  />
                  <Input
                      controlado={false}            
                      campo={camposPresupuesto.id_fiscal}
                      onCampoCambiado={onCampoCambiado}
                      valorEntidad={presupuesto.id_fiscal}
                  />
                  <Input
                      controlado={false}            
                      campo={camposPresupuesto.direccion_id}
                      onCampoCambiado={onCampoCambiado}
                      valorEntidad={presupuesto.direccion_id}
                  />
                </>
              }
            />,
            <Tab
              key="tab-3"
              label="Observaciones"
              children={<div> Observaciones contenido </div>}
            />,
          ]}
        ></Tabs>
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            marginBottom: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
              Neto:
            </label>
            <span>
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(Number(presupuesto?.neto ?? 0))}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
              Total IVA:
            </label>
            <span>
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
              }).format(Number(presupuesto?.total_iva ?? 0))}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
              Total:
            </label>
            <span>
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: (presupuesto?.coddivisa as string) ?? "EUR",
              }).format(Number(presupuesto?.total ?? 0))}
            </span>
          </div>
        </div>
        (lineas presupuesto)
        {/* <SubVista>
          <Maestro
            Acciones={MaestroAccionesLineasPresupuesto}
            acciones={accionesLineasPresupuesto}
            camposEntidad={camposLineasPresupuestoAlta}
          />
        </SubVista> */}
      </Detalle>
    </div>
  );
}
