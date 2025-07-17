import { useParams } from "react-router";

type Estado = "defecto";

export const DetalleEvento = ({

}: {

}) => {
  const params = useParams();
  console.log("params", params);
  
  return (
    <>hola mundo</>
  );
};