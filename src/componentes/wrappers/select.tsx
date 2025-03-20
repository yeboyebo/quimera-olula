import estilos from "./select.module.css";

type SelectProps = {
  label: string;
  nombre: string;
  deshabilitado?: boolean;
  placeholder?: string;
  valor?: string;
  textoValidacion?: string;
  opciones?: { valor: string; descripcion: string }[];
  erroneo?: boolean;
  advertido?: boolean;
  valido?: boolean;
  opcional?: boolean;
  condensado?: boolean;
};

export const Select = ({
  label,
  nombre,
  deshabilitado,
  placeholder,
  valor = "",
  textoValidacion = "",
  opciones = [],
  erroneo,
  advertido,
  valido,
  opcional,
  condensado,
}: SelectProps) => {
  const options = opciones.map((opcion) => (
    <option key={opcion.valor} value={opcion.valor}>
      {opcion.descripcion}
    </option>
  ));

  const { root, etiqueta, etiquetaOpcional, validacion } = estilos;

  const clases = [
    root,
    deshabilitado ? estilos.deshabilitado : "",
    erroneo ? estilos.erroneo : "",
    advertido ? estilos.advertido : "",
    valido ? estilos.valido : "",
    opcional ? estilos.opcional : "",
    condensado ? estilos.condensado : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={clases}>
      <span className={etiqueta}>
        {label}&nbsp;
        <span className={etiquetaOpcional}>(opcional)</span>
      </span>
      <select name={nombre} defaultValue={valor} disabled={deshabilitado}>
        <option hidden value="">
          -{placeholder}-
        </option>
        {options}
      </select>
      <span className={validacion}>{textoValidacion}</span>
    </label>
  );
};
