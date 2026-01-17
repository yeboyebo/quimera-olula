export type FormFieldProps = {
  label: string;
  nombre: string;
  deshabilitado?: boolean;
  placeholder?: string;
  valor?: string;
  textoValidacion?: string;
  erroneo?: boolean;
  advertido?: boolean;
  valido?: boolean;
  opcional?: boolean;
  condensado?: boolean;
  autoSeleccion?: boolean;
  autoFocus?: boolean;
  ref?: React.RefObject<HTMLInputElement | null>;
  onChange?: (
    valor: string,
    evento: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onBlur?: (valor: string, evento: React.FocusEvent<HTMLElement>) => void;
  onEnterKeyUp?: (valor: string, evento: React.KeyboardEvent<HTMLElement>) => void;
};

const tiposFormInput = {
  texto: "text",
  numero: "number",
  entero: "number",
  decimal: "number",
  fecha: "date",
  hora: "time",
  fecha_hora: "datetime-local",
  contraseña: "password",
  email: "email",
  checkbox: "checkbox",
  radio: "radio",
  telefono: "tel",
  color: "color",
  fichero: "file",
  url: "url",
  rango: "range",
  moneda: "number",
  autocompletar: "text",
  selector: "text",
} as const;

export type FormInputProps = FormFieldProps & {
  lista?: string;
  autocompletar?: "off" | "on";
  onInput?: (valor: string, evento: React.FormEvent<HTMLInputElement>) => void;
  tipo?: keyof typeof tiposFormInput;
};

type InputProps = Omit<FormInputProps, "label"> & {
  checked?: boolean;
  autoFocus?: boolean;
};

export const FormInput = ({
  nombre,
  deshabilitado,
  placeholder,
  tipo = "texto",
  valor = "",
  checked,
  opcional,
  lista,
  autocompletar,
  autoSeleccion,
  autoFocus,
  ref,
  onChange,
  onBlur,
  onInput,
  onEnterKeyUp,
}: InputProps) => {
  const obtenerValorPorDefecto = () => {
    if (valor !== undefined && valor !== "" && valor != null) return valor;

    switch (tipo) {
      case "numero":
      case "moneda":
      case "rango":
        return "";
      default:
        return "";
    }
  };

  const valorFinal = onChange ? obtenerValorPorDefecto() : undefined;

  const manejarFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (autoSeleccion) {
      e.target.select();
    }
  };

  const manejarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (tipo == "fecha") {
      console.log('Evento fecha', e);
    }
    onChange?.(e.target.value, e);
  };

  const manejarBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e.target.value, e);
  };

  const manejarInput = (e: React.FormEvent<HTMLInputElement>) => {
    onInput?.((e.target as HTMLInputElement).value, e);
  };

  const manejarKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const evento = e.target as unknown as {
        value: string;
      };
      onEnterKeyUp?.(evento.value, e);
    }
  };
  
  return (
    <input
      type={tiposFormInput[tipo] ?? "text"}
      name={nombre}
      placeholder={placeholder}
      value={valorFinal}
      defaultValue={onChange ? undefined : valor}
      checked={onChange ? checked : undefined}
      defaultChecked={onChange ? undefined : checked}
      disabled={deshabilitado}
      required={!opcional}
      list={lista}
      autoComplete={autocompletar}
      onChange={manejarChange}
      onBlur={manejarBlur}
      onFocus={manejarFocus}
      onInput={manejarInput}
      onKeyUp={manejarKeyUp}
      autoFocus={autoFocus}
      ref={ref}
    />
  );
};

export const Etiqueta = ({ label }: { label: string }) => {
  return (
    <span className="etiqueta">
      {label}
      <span className="etiqueta-opcional">(opcional)</span>
    </span>
  );
};

export const Validacion = ({
  textoValidacion,
}: {
  textoValidacion: string;
}) => {
  if (!textoValidacion) return null;

  return <span className="texto-validacion">{textoValidacion}</span>;
};
