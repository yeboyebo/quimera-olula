import { Box, Button } from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import { navigate } from "hookrouter";
import Quimera, { PropValidation, useAppValue, useStateValue } from "quimera";
import React from "react";
import { useTranslation } from "react-i18next";

function Lineas({ useStyles }) {
  const [confirmando, dispatch] = useStateValue();
  const [{ carrito }] = useAppValue();
  const { t } = useTranslation();

  return (
    <Quimera.Template id="Lineas">
      <List disablePadding dense>
        {carrito.lineas.map(linea => (
          // <ItemLineaCarritoCheckout key={linea.idLinea} model={linea} modelName='lineaCarrito' />
          <Quimera.SubView
            id="ItemLineaCarritoCheckout"
            key={linea.idLinea}
            model={linea}
            modelName="lineaCarrito"
          />
        ))}
      </List>
      <Box mt={1} width={1} display="flex" justifyContent="space-around">
        <Button
          id="volverCatalogo"
          text={t("checkout.volverCatalogo")}
          variant="outlined"
          color="primary"
          onClick={() => navigate("/catalogo")}
        />
        <Button
          id="confirmarPedido"
          text={t("checkout.confirmarPedido")}
          variant="contained"
          color="primary"
          disable={confirmando.smState === "confirmando"}
        />
      </Box>
    </Quimera.Template>
  );
}

export default Lineas;
