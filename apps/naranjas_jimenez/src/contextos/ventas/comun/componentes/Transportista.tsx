import { QSelect } from "@olula/componentes/index.js";
import { QAutocompletarProps } from "@olula/componentes/moleculas/qautocompletar.tsx";
import { useEffect, useState } from "react";
import { getItemsListaTransportista } from "../../transportista/infraestructura.ts";

type TransportistaProps = Omit<QAutocompletarProps, "obtenerOpciones">;

type OpcionTransportista = {
  valor: string;
  descripcion: string;
};

export const Transportista = ({
  valor,
  nombre = "transportista",
  label = "Transportista",
  onChange,
  ...props
}: TransportistaProps) => {
  const [opcionesTransportista, setOpcionesTransportista] = useState<OpcionTransportista[]>([]);

  useEffect(() => {
    const cargarOpcionesTransportista = async () => {
      const items = await getItemsListaTransportista([], []);
      setOpcionesTransportista(items.map((item) => ({ valor: item.id, descripcion: item.descripcion })));
    };
    cargarOpcionesTransportista();
  }, []);

  return (
    <QSelect
      label={label}
      nombre={nombre}
      valor={valor}
      onChange={onChange}
      opciones={opcionesTransportista}
      {...props}
    />
  );
};
