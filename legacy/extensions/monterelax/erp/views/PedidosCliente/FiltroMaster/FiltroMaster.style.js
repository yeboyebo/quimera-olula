export default parent => {
  return theme => {
    const _p = parent(theme);

    return {
      ..._p,
      appBar: {
        // backgroundColor: theme.palette.background.paper,
        backgroundColor: `${theme.palette.grey[200]} !important`,
        padding: `${theme.spacing(1, 1)} !important`,
        border: "0px !important",
        boxShadow: "none !important",
      },
    };
  };
};
