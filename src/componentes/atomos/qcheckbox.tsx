import "./_forminput.css";
import {
  Etiqueta,
  FormInput,
  FormInputProps,
  Validacion,
} from "./_forminput.tsx";
import "./qcheckbox.css";

type QCheckBoxProps = Omit<FormInputProps, "valor"> & {
  valor: boolean;
};

export const QCheckbox = ({
  label,
  nombre,
  deshabilitado,
  textoValidacion = "",
  valor = false,
  erroneo,
  advertido,
  valido,
  opcional,
  condensado,
  onChange,
  ...props
}: QCheckBoxProps) => {
  const attrs = {
    nombre,
    erroneo,
    advertido,
    valido,
    opcional,
    condensado,
    deshabilitado,
  };

  const manejarChange = (
    _valor: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange?.(e.target.checked.toString(), e);
  };

  const inputAttrs = {
    nombre,
    deshabilitado,
    opcional,
    checked: valor,
    tipo: "checkbox" as const,
    onChange: manejarChange,
    ...props,
  };

  return (
    <quimera-checkbox {...attrs}>
      <label>
        <FormInput {...inputAttrs} />
        <Etiqueta label={label} />
        <Validacion textoValidacion={textoValidacion} />
      </label>
    </quimera-checkbox>
  );
};
