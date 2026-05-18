import { Box, Chip, QListItem, QTitleBox, Typography, Icon } from "@quimera/comps";
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
  chipMkt: {
    borderRadius: 4,
    marginRight: theme.spacing(0.5),
    fontSize: "0.8rem",
    backgroundColor: "#FAEB8C",
    textTransform: "uppercase",
  },
  chipFarma: {
    borderRadius: 4,
    marginRight: theme.spacing(0.5),
    fontSize: "0.8rem",
    backgroundColor: "#FFC0CB",
    textTransform: "uppercase",
  },
}));

export default function ListTratosCliente({ lineas }) {
  const [, dispatch] = useStateValue();
  const classes = useStyles();

  return (
    <Box className={classes.box}>
      <QTitleBox titulo="Tratos pendientes">
        {/* {!!lineas?.idList == 0 && ( */}
        {/* <List> */}
        <Divider />
        {lineas.idList.length > 0 ? (
          <Box id="scrollableBoxTratos" style={{ maxHeight: "300px", overflowY: "auto" }}>
            <InfiniteScroll
              dataLength={lineas.idList ? lineas?.idList?.length : 0}
              next={() => dispatch({ type: `onNextTratosPendientes` })}
              hasMore={lineas?.page?.next !== null}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableBoxTratos"
            >
              {/* <List> */}
              {Object.values(lineas?.dict ?? {})
                ?.sort((a, b) => {
                  const dateCompare = new Date(b?.fecha) - new Date(a?.fecha);
                  return dateCompare !== 0 ? dateCompare : (a?.idTrato - b?.idTrato);
                })
                ?.map(trato => {
                  return (
                    <Box style={{ marginRight: "5px" }}>
                      <QListItem
                        key={trato?.idTrato}
                        // avatar={{
                        //   icon: "account_circle",
                        //   color: "",
                        // }}
                        onClick={() => navigate(`/ss/tratos/${trato.idTrato}`)}
                        alignActions="flex-end"
                        tl={
                          <Box display={"flex"}>
                            {`${trato?.titulo ?? ""}`}
                          </Box>
                        }
                        ml={
                          <Box display={"flex"}>
                            {trato?.idCampania && (
                              <Chip label={"MKT"} size="small" className={classes.chipMkt} />
                            )}
                            {util.getUser().tratolicenciafarma === trato.idTipotrato && (
                              <Chip label={"Farma"} size="small" className={classes.chipFarma} />
                            )}
                          </Box>
                        }
                        tr={util.formatDate(trato?.fecha)}
                        bl={` ${trato?.tipotrato ?? "*"} || ${util.euros(trato?.valor ?? 0)}`}
                      />
                    </Box>
                  );
                })}
            </InfiniteScroll>
          </Box>
        ) : (
          <Typography variant="spam" style={{ textAlign: "center", padding: "20px" }}>
            No hay tratos pendientes
          </Typography>
        )}
        <Divider />
      </QTitleBox>
    </Box >
  );
}
