import { PaisSelector } from "#/comun/componentes/pais/pais.tsx";
import { QInput } from "@olula/componentes/atomos/qinput.tsx";
import { UiProps } from "@olula/lib/useModelo.ts";
import "./CamposDireccionProveedor.css";

/**
 * Campos de dirección del proveedor, compartidos por el alta y la edición.
 * Devuelve un fragmento: tiene que ser hijo directo de `quimera-formulario`,
 * y el contenedor del formulario debe llevar la clase `campos-direccion-proveedor`.
 */
export const CamposDireccionProveedor = ({
  uiProps,
}: {
  uiProps: (campo: string, secundario?: string) => UiProps;
}) => (
  <>
    <QInput label="Tipo de Vía" {...uiProps("tipoVia")} />
    <QInput label="Nombre de la Vía" {...uiProps("nombreVia")} />
    <QInput label="Número" {...uiProps("numero")} />
    <QInput label="Otros" {...uiProps("otros")} />
    <QInput label="Cód. Postal" {...uiProps("codPostal")} />
    <QInput label="Ciudad" {...uiProps("ciudad")} />
    <QInput label="Provincia" {...uiProps("provincia")} />
    <PaisSelector label="País" {...uiProps("paisId", "pais")} />
    {/* <QInput label="Apartado" {...uiProps("apartado")} /> */}
    <QInput label="Teléfono" {...uiProps("telefono")} />
  </>
);
