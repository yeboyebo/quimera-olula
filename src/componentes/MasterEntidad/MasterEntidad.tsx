import { useEffect, useState, useContext } from "react";
import {type Entidad } from "../Master";


export const MasterEntidad = <T extends Entidad>({ entidad }: { entidad: T }) => {
  const { id, ...resto } = entidad;

  return (
    <li key={id} style={{ display: "flex", flexDirection: "column" }}>
      <span>Cliente: {id}</span>
      {Object.entries(resto).map(([clave, valor]) => (
        <span style={{ marginLeft: "1rem" }} key={clave}>
          {clave}: {valor}
        </span>
      ))}
    </li>
  );
};
