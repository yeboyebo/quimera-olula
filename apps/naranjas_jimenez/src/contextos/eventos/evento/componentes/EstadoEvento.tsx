import { useState } from "react";

export const EstadoEvento = ({ estado }: { estado: string | null }) => {
  const [tooltip, setTooltip] = useState<{ show: boolean; top: number; left: number }>({ show: false, top: 0, left: 0 });
  
  const onMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ show: true, top: rect.top - 40, left: rect.left + rect.width / 2 });
  };  
  
  return (
    <span 
      className="indicador-estado" 
      style={{ background: estado === "Confirmado" ? "green" : "red" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => setTooltip(prev => ({ ...prev, show: false }))}
    >
      {tooltip.show && (
        <div className="tooltip-custom" style={{ top: tooltip.top, left: tooltip.left, transform: 'translateX(-50%)' }}>
          {!!estado && estado.length > 0 ? estado : "Sin estado"}
        </div>
      )}
    </span>
  );
};