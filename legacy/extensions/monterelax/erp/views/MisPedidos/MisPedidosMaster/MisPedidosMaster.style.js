export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      pte: {
        backgroundColor: `${theme.palette.error.main} !important`,
      },
      terminado: {
        backgroundColor: `${theme.palette.success.main}`,
      },
      produccion: {
        backgroundColor: `${theme.palette.warning.main}`,
      },
      cargado: {
        backgroundColor: `${theme.palette.info.main}`,
      },
      texto: {
        color: "red",
      },
    };
  };
};
