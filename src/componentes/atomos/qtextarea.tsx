import {
  Etiqueta,
  FormFieldProps,
  Validacion
} from "./_forminput.tsx";
import "./qtextarea.css";

type TextAreaProps = FormFieldProps & {
  onInput?: (valor: string, evento: React.FormEvent<HTMLTextAreaElement>) => void;
  rows?: number;
};

export const QTextArea = ({
  label,
  nombre,
  deshabilitado,
  textoValidacion = "",
  placeholder,
  valor = "",
  erroneo,
  advertido,
  valido,
  opcional,
  condensado,
  onChange,
  onBlur,
  onInput,
  ...props
}: TextAreaProps) => {
  const attrs = {
    nombre,
    erroneo,
    advertido,
    valido,
    opcional,
    condensado,
    deshabilitado,
  };

  // const inputAttrs = {
  //   nombre,
  //   deshabilitado,
  //   opcional,
  //   tipo,
  //   ...props,
  // };

  const manejarFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.select();
  };

  const manejarChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value || '', e);
  };

  const manejarBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    onBlur?.(e.target.value || '', e);
  };

  const manejarInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    onInput?.((e.target as HTMLTextAreaElement).value, e);
  };
  console.log("QTextArea valor", valor);

  return (
    <quimera-textarea {...attrs}>
      <label>
        <Etiqueta label={label} />
        <textarea
        {...props}
        name={nombre}
        placeholder={placeholder}
        value={onChange ? (valor || '') : undefined}
        defaultValue={onChange ? undefined : valor}
        disabled={deshabilitado}
        required={!opcional}
        onChange={manejarChange}
        onBlur={manejarBlur}
        onFocus={manejarFocus}
        onInput={manejarInput}
        />
        <Validacion textoValidacion={textoValidacion} />
      </label>
    </quimera-textarea>
  );
};
