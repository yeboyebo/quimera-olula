import { ArticuloLinea } from "#/ventas/comun/componentes/articulo_linea/ArticuloLinea.tsx";
import { GrupoIvaProducto } from "#/ventas/comun/componentes/grupo_iva_producto.tsx";
import { QBoton } from "@olula/componentes/atomos/qboton.tsx";
import { QCheckbox } from "@olula/componentes/atomos/qcheckbox.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { QModal } from "@olula/componentes/index.js";
import { useForm } from "@olula/lib/useForm.js";
import { ProcesarEvento } from "@olula/lib/useMaquina.js";
import { useModelo } from "@olula/lib/useModelo.ts";
import { useCallback, useMemo, useState } from "react";
import { LineaAlbaran } from "../diseño.ts";
import { patchLinea } from "../infraestructura.ts";
import "./CambiarLinea.css";
import { getModeloInicial, metaLinea, ModeloCambiarLinea } from "./dominio.ts";

export const CambiarLinea = ({
  publicar,
  linea,
  albaranId,
}: {
  linea: LineaAlbaran;
  albaranId: string;
  publicar: ProcesarEvento;
}) => {
  const modeloInicial = useMemo(() => getModeloInicial(linea), [linea.id]);

  const { modelo, uiProps, valido, set } = useModelo<ModeloCambiarLinea>(metaLinea, modeloInicial);
  const [mostrarMas, setMostrarMas] = useState(false);

  const cambiar_ = useCallback(async () => {
    await patchLinea(albaranId, modelo);
    publicar("linea_actualizada");
  }, [modelo, publicar, albaranId]);

  const cancelar_ = useCallback(
    () => publicar("editar_linea_cancelado"),
    [publicar]
  );

  const [cambiar, cancelar] = useForm(cambiar_, cancelar_);

  const libre = modelo.tipoArticulo === "libre";

  return (
    <QModal
      abierto={true}
      nombre="editar_linea_albaran"
      titulo="Editar línea"
      onCerrar={cancelar}
    >
      <div className="EditarLinea">
        <quimera-formulario>
          <ArticuloLinea
            tipo={modelo.tipoArticulo}
            idArticulo={modelo.referencia}
            articulo={modelo.descripcionArticulo}
            descripcion={modelo.descripcion}
            nombre="referencia_cambiar_linea_albaran"
            onChange={(cambios) => set({ ...modelo, ...cambios })}
            bloqueado={true}
          />

          <QInput label="Cantidad" {...uiProps("cantidad")} />

          <QInput label="Precio" {...uiProps("pvp_unitario")} />

          <div className="mostrar-mas-fila">
            <button
              type="button"
              className="mostrar-mas-btn"
              onClick={() => setMostrarMas((v) => !v)}
            >
              {mostrarMas ? "▲ Menos opciones" : "▼ Más opciones"}
            </button>
          </div>

          {mostrarMas && (
            <>
              <div className="seccion-separador">Descuento</div>
              <QInput label="% Descuento" {...uiProps("dto_porcentual")} />
              <QInput label="Dto. lineal" {...uiProps("dto_lineal")} />

              <div className="seccion-separador">Impuestos</div>
              <GrupoIvaProducto {...uiProps("grupo_iva_producto_id")} soloLectura={!libre} />
              <QInput label="% IVA" {...uiProps("tipo_iva")} soloLectura />
              <QCheckbox label="IVA incluido" {...uiProps("iva_incluido")} soloLectura={!libre} />
              <QInput label="% I.R.P.F." {...uiProps("tipo_irpf")} />
              <QInput label="% Comisión agente" {...uiProps("por_comision")} />
              <QInput label="Importe comisión" {...uiProps("importe_comision")} />
            </>
          )}
        </quimera-formulario>

        <div className="botones maestro-botones ">
          <QBoton onClick={cambiar} deshabilitado={!valido}>
            Guardar
          </QBoton>
        </div>
      </div>
    </QModal>
  );
};
