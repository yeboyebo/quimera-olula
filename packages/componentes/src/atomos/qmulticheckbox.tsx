import "./_forminput.css";
import { QCheckbox, QCheckboxProps } from "./qcheckbox.tsx";
import "./qmulticheckbox.css";

export type Opcion = { valor: string; descripcion: string };

type QMultiCheckboxProps = QCheckboxProps & {
  opciones: Opcion[];
};

export const QMultiCheckbox = ({
  opciones,
  label,
  valor,
  onChange,
  ...props
}: QMultiCheckboxProps) => {
  const valores = valor as unknown as string[];

  const manejarChange =
    (id: string) => (v: string, e: React.ChangeEvent<HTMLInputElement>) => {
      const tieneId = valores.includes(id);

      if (v === "true" && !tieneId) {
        const nuevoValor = [...valores, id].toSorted();

        onChange?.(nuevoValor as unknown as string, e);
      } else if (v === "false" && tieneId) {
        const nuevoValor = valores.filter((v) => v !== id);

        onChange?.(nuevoValor as unknown as string, e);
      }
    };

  return (
    <fieldset>
      {label}
      {opciones.map(({ valor, descripcion }) => (
        <QCheckbox
          {...props}
          key={valor}
          id={valor}
          label={descripcion}
          valor={valores.includes(valor)}
          onChange={manejarChange(valor)}
        />
      ))}
    </fieldset>
  );
};
