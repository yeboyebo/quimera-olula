import { Typography, Button, Grid } from "@quimera/comps";
import Quimera, { PropValidation, useStateValue } from "quimera";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@quimera/thirdparty";
import React from "react";
import { useTranslation } from "react-i18next";
import { navigate } from "hookrouter";

function Confirmacion({ useStyles }) {
  const [, dispatch] = useStateValue();
  // const classes = useStyles()
  const { t } = useTranslation();

  return (
    <Quimera.Template id="Confirmacion">
      <Dialog
        open={true}
        keepMounted
        minWidth="sm" fullWidth
      >
        <DialogTitle>
          <Grid container alignItems="center" justify="space-between">
            {t("pedidoConfirmado.titulo")}
          </Grid>
        </DialogTitle>
        <DialogContent dividers={true}>
          <Typography>{t("pedidoConfirmado.parrafo1")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            id="confirmacionVolver"
            text={t("pedidoConfirmado.aceptar")}
            color="primary"
            variant="contained"
            onClick={() => navigate("/")}
          />
        </DialogActions>
      </Dialog>

    </Quimera.Template>
  );
}

export default Confirmacion;
