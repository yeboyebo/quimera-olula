import { Box, QListItem, QTitleBox, Typography, Icon } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Divider } from "@quimera/thirdparty";
import InfiniteScroll from "react-infinite-scroll-component";
import { useStateValue, util } from "quimera";
import { navigate } from "hookrouter";

const useStyles = makeStyles(theme => ({
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "0.03em",
  },
}));

export default function ListPresupuestosCliente({ lineas }) {
  const [, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <Box className={classes.box}>
      <QTitleBox titulo="Presupuestos pendientes">
        {/* {!!lineas?.idList == 0 && ( */}
        {/* <List> */}
        <Divider />
        {lineas.idList.length > 0 ? (
          <Box id="scrollableBoxPresupuestos" style={{ maxHeight: "300px", overflowY: "auto" }}>
            <InfiniteScroll
              dataLength={lineas.idList ? lineas?.idList?.length : 0}
              next={() => {
                dispatch({ type: `onNextPresupuestosPendientes` });
              }}
              hasMore={lineas?.page?.next !== null}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableBoxPresupuestos"
            >
              {/* <List> */}
              {Object.values(lineas?.dict ?? {})
                ?.sort((a, b) => {
                  const dateCompare = new Date(b?.fecha) - new Date(a?.fecha);
                  return dateCompare !== 0 ? dateCompare : (a?.idPresupuesto - b?.idPresupuesto);
                })
                ?.map(presupuesto => {
                  return (
                    <Box style={{ marginRight: "5px" }}>
                      <QListItem
                        key={presupuesto?.idPresupuesto}
                        // avatar={{
                        //   icon: "account_circle",
                        //   color: "",
                        // }}
                        onClick={() => navigate(`/ventas/presupuestos/${presupuesto.idPresupuesto}`)}
                        alignActions="flex-end"
                        tl={
                          <Box display={"flex"}>
                            {`${presupuesto?.codigo ?? ""}`}
                          </Box>
                        }
                        tr={util.euros(presupuesto.total)}
                        bl={util.formatDate(presupuesto?.fecha)}
                      />
                    </Box>
                  );
                })}
            </InfiniteScroll>
          </Box>
        ) : (
          <Typography variant="spam" style={{ textAlign: "center", padding: "20px" }}>
            No hay presupuestos pendientes
          </Typography>
        )}
        <Divider />
      </QTitleBox>
    </Box >
  );
}
