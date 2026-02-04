import "./_forminput.css";
import {
  Etiqueta,
  FormInput,
  FormInputProps,
  Validacion,
} from "./_forminput.tsx";

type QInputProps = FormInputProps;

export const QInput = ({
  label,
  nombre,
  deshabilitado,
  textoValidacion = "",
  erroneo,
  advertido,
  valido,
  opcional,
  condensado,
  tipo,
  ...props
}: QInputProps) => {
  const attrs = {
    nombre,
    erroneo,
    advertido,
    valido,
    opcional,
    condensado,
    deshabilitado,
    tipo,
  };

  const inputAttrs = {
    nombre,
    deshabilitado,
    opcional,
    tipo,
    ...props,
  };

  return (
    <quimera-input {...attrs}>
      <label>
        <Etiqueta label={label} />
        <div className="input_">
          <FormInput {...inputAttrs} />
        </div>
        <Validacion textoValidacion={textoValidacion} />
      </label>
    </quimera-input>
  );
};
