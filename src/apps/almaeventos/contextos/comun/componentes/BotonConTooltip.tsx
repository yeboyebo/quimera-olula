import { ReactNode, useState } from "react";
import "./TextoConTooltip/TextoConTooltip.css";

export const BotonConTooltip = ({
  children,
  tooltip,
  ...props
}: {
  children: ReactNode;
  tooltip: string;
  [key: string]: any;
}) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const onMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ top: rect.top - 40, left: rect.left + rect.width / 2 });
    setShow(true);
  };

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button
        {...props}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </button>
      {show && (
        <div
          className="tooltip-custom"
          style={{
            top: coords.top,
            left: coords.left,
            transform: "translateX(-50%)",
            position: "fixed",
            zIndex: 9999,
          }}
        >
          {tooltip}
        </div>
      )}
    </span>
  );
};
