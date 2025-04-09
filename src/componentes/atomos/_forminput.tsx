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
  onChange?: (valor: string, evento: React.ChangeEvent<HTMLElement>) => void;
  onBlur?: (valor: string, evento: React.FocusEvent<HTMLElement>) => void;
};

const tiposFormInput = {
  texto: "text",
  numero: "number",
  fecha: "date",
  contraseña: "password",
  email: "email",
  checkbox: "checkbox",
} as const;

export type FormInputProps = FormFieldProps & {
  lista?: string;
  autocompletar?: "off" | "on";
  onInput?: (valor: string, evento: React.FormEvent<HTMLInputElement>) => void;
};

type InputProps = Omit<FormInputProps, "label"> & {
  tipo?: keyof typeof tiposFormInput;
};

export const FormInput = ({
  nombre,
  deshabilitado,
  placeholder,
  tipo = "texto",
  valor = "",
  opcional,
  lista,
  autocompletar,
  onChange,
  onBlur,
  onInput,
}: InputProps) => {
  return (
    <input
      type={tiposFormInput[tipo] ?? "text"}
      name={nombre}
      placeholder={placeholder}
      value={onChange ? valor : undefined}
      defaultValue={onChange ? undefined : valor}
      disabled={deshabilitado}
      required={!opcional}
      list={lista}
      autoComplete={autocompletar}
      onChange={(e) => onChange?.(e.target.value, e)}
      onBlur={(e) => onBlur?.(e.target.value, e)}
      onInput={(e) => onInput?.((e.target as HTMLInputElement).value, e)}
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
  return <span className="texto-validacion">{textoValidacion}</span>;
};
