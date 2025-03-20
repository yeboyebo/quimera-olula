import "./icono.css";

type IconoProps = {
  nombre: string;
  tamaño?: "xs" | "sm" | "md" | "lg" | "xl";
};

export const Icono = ({ nombre, tamaño }: IconoProps) => {
  return (
    <quimera-icono>
      <box-icon name={nombre} size={tamaño}></box-icon>
    </quimera-icono>
  );
};
