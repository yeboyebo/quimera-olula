export type FormInputProps = {
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
