import PropTypes from "prop-types";
import { useWidth } from "quimera";
import React from "react";

import { Box } from "../";

function QMasterDetail({ MasterComponent, DetailComponent, current, loading, variant }) {
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const desktop = !mobile;
  const variantDict = {
    partida_vertical: {
      masterVisible: desktop || (mobile && !current) || (mobile && current === "nuevo"),
      detalleVisible: !!current && current !== "nuevo",
    },
    fullscreen: { masterVisible: !current, detalleVisible: current },
    onlydetail: { masterVisible: loading, detalleVisible: current },
  };

  const masterVisible = variantDict[variant].masterVisible;
  const detalleVisible = variantDict[variant].detalleVisible;

  console.log("detalleVisible", detalleVisible, current);

  return (
    <Box mx={desktop ? 0.5 : 0}>
      <Box width={1} display="flex" justifyContent={variant === "onlydetail" ? "center" : "none"}>
        {masterVisible && MasterComponent}
        {detalleVisible && DetailComponent}
      </Box>
    </Box>
  );
}

QMasterDetail.propTypes = {
  current: PropTypes.any,
  DetailComponent: PropTypes.object,
  MasterComponent: PropTypes.object,
  variant: PropTypes.string,
  loading: PropTypes.bool,
};

QMasterDetail.defaultProps = {
  variant: "partida_vertical",
  loading: false,
};

export default QMasterDetail;
