import "./_forminput.css";
import { Etiqueta, FormFieldProps, Validacion } from "./_forminput.tsx";

export type QMonthYearProps = Omit<FormFieldProps, "label"> & {
  label?: string;
};

export const QMonthYear = ({
  label,
  nombre,
  deshabilitado,
  textoValidacion = "",
  erroneo,
  advertido,
  valido,
  opcional,
  condensado,
  valor,
  onChange,
}: QMonthYearProps) => {
  const attrs = {
    nombre,
    erroneo,
    advertido,
    valido,
    opcional,
    condensado,
    deshabilitado,
  };

  const manejarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value, e);
  };

  return (
    <quimera-date {...attrs}>
      <label>
        {label && <Etiqueta label={label} />}
        <input
          type="month"
          name={nombre}
          disabled={deshabilitado}
          required={!opcional}
          value={valor ?? ""}
          onChange={manejarChange}
        />
        <Validacion textoValidacion={textoValidacion} />
      </label>
    </quimera-date>
  );
};
