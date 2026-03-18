import "./_forminput.css";
import { QInput, QInputProps } from "./qinput.tsx";

type QNumberIntervalProps = QInputProps;

export const QNumberInterval = ({
  label,
  nombre,
  valor,
  onChange,
  ...props
}: QNumberIntervalProps) => {
  const [desde, hasta] = valor as unknown as [string, string];

  const manejarChange = (v: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const clave = e.target.name.split("__")[1];

    const nuevoValor = [
      clave === "desde" ? v : desde,
      clave === "hasta" ? v : hasta,
    ] as [string, string];

    onChange?.(nuevoValor as unknown as string, e);
  };

  return (
    <>
      <QInput
        {...props}
        label={label + " desde"}
        nombre={nombre + "__desde"}
        valor={desde}
        onChange={manejarChange}
      />
      <QInput
        {...props}
        label={label + " hasta"}
        nombre={nombre + "__hasta"}
        valor={hasta}
        onChange={manejarChange}
      />
    </>
  );
};
