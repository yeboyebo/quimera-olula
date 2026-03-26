import { Box, Icon, QListItem, QTitleBox, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Divider } from "@quimera/thirdparty";
import { navigate } from "hookrouter";
import { useStateValue, util } from "quimera";
import { ACL } from "quimera/lib";
import InfiniteScroll from "react-infinite-scroll-component";

const useStyles = makeStyles(theme => ({
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "0.03em",
  },
}));

export default function ListResponsableCurso({ lineas }) {
  const [, dispatch] = useStateValue();
  const classes = useStyles();
  // const actionEnabled =
  //   util.getUser().group === "MKT" || util.getUser().group === "Responsable de marketing"
  //     ? true
  //     : false;
  const actionEnabled = true;

  return (
    <Box className={classes.box}>
      <QTitleBox titulo="Responsables Curso">
        {/* {!!lineas?.idList == 0 && ( */}
        {/* <List> */}
        <Divider />
        {lineas.idList.length > 0 ? (
          <Box id="scrollableBoxResponsables" style={{ maxHeight: "300px", overflowY: "auto" }}>
            <InfiniteScroll
              dataLength={lineas.idList ? lineas?.idList?.length : 0}
              next={() => dispatch({ type: `onNextResponsablesEvento` })}
              hasMore={lineas?.page?.next !== null}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableBoxResponsables"
            >
              {/* <List> */}
              {Object.values(lineas?.dict ?? {})
                ?.sort((a, b) => a.codAgente > b.codAgente)
                ?.map(responsable => {
                  return (
                    <QListItem
                      key={responsable?.codAgente}
                      avatar={{
                        icon: "account_circle",
                        color: "",
                      }}
                      acciones={
                        actionEnabled
                          ? [
                            <Box
                              className=""
                              onClick={() =>
                                dispatch({
                                  type: `${lineas?.idList?.length > 1 ? "onRemoveResponsableEvento" : "onAvisoUltimoResponsableEvento"}`,
                                  payload: { codAgente: responsable?.codAgente },
                                })
                              }
                            >
                              <Icon>delete</Icon>
                            </Box>,
                          ]
                          : []
                      }
                      alignActions="flex-end"
                      tl={responsable?.nombreResponsable ?? ""}
                      bl={responsable?.emailResponsable}
                    // tr={util.formatDate(curso?.fechaIni)}
                    // tl={responsable?.telefonoResponsable}
                    />
                  );
                })}
              {/* </List> */}
            </InfiniteScroll>
          </Box>
        ) : (
          <Typography variant="spam" style={{ textAlign: "center", padding: "20px" }}>
            No hay responsables
          </Typography>
        )}
        <Divider />
      </QTitleBox>
    </Box>
  );
}
