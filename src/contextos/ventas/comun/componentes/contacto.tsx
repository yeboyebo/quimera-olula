import { QAutocompletar } from "../../../../componentes/moleculas/qautocompletar.tsx";
import { Filtro, Orden } from "../../../comun/diseño.ts";
import { getCrmContactos } from "../../cliente/infraestructura.ts";

interface ContactoSelectorProps {
  descripcion?: string;
  valor: string;
  nombre?: string;
  label?: string;
  onChange: (opcion: { valor: string; descripcion: string } | null) => void;
}

export const ContactoSelector = ({
  descripcion = "",
  valor,
  nombre = "contacto_id",
  label = "Seleccionar contacto",
  onChange,
}: ContactoSelectorProps) => {
  const obtenerOpciones = async (valor: string) => {
    if (valor.length < 3) return [];

    const criteria = {
      filtro: {
        nombre: {
          LIKE: valor,
        },
      },
      orden: { id: "DESC" },
    };

    const contactos = await getCrmContactos(
      criteria.filtro as unknown as Filtro,
      criteria.orden as Orden
    );

    return contactos.map((contacto) => ({
      valor: contacto.id,
      descripcion: contacto.nombre + " - " + contacto.email,
    }));
  };

  return (
    <QAutocompletar
      label={label}
      nombre={nombre}
      onChange={onChange}
      valor={valor}
      autoSeleccion
      obtenerOpciones={obtenerOpciones}
      descripcion={descripcion}
    />
  );
};
