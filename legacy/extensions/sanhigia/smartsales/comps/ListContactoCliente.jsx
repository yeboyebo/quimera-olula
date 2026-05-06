import { Box, QListItem, QTitleBox, Typography } from "@quimera/comps";
import { makeStyles } from "@quimera/styles";
import { Divider, InfiniteScroll } from "@quimera/thirdparty";
import { navigate, useStateValue, util } from "quimera";

const useStyles = makeStyles(theme => ({
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "0.03em",
  },
}));

export default function ListContactoCliente({ lineas }) {
  const [, dispatch] = useStateValue();
  const classes = useStyles();
  const actionEnabled = util.getUser().group === "MKT" || util.getUser().group === "Responsable de marketing" ? true : false;


  return (
    <Box className={classes.box}>
      <QTitleBox titulo="Contactos">
        {/* {!!lineas?.idList == 0 && ( */}
        {/* <List> */}
        <Divider />
        {lineas.idList.length > 0 ? (
          <Box id="scrollableBoxContactos" style={{ maxHeight: "300px", overflowY: "auto" }}>
            <InfiniteScroll
              dataLength={lineas.idList ? lineas?.idList?.length : 0}
              next={() => dispatch({ type: `onNextContactos` })}
              hasMore={lineas?.page?.next !== null}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableBoxContactos"
            >
              {/* <List> */}
              {Object.values(lineas?.dict ?? {})
                ?.map(contacto => {
                  return (
                    <Box style={{ marginRight: "5px" }}>
                      <QListItem
                        key={contacto?.codContacto}
                        avatar={{
                          icon: "account_circle",
                          color: "",
                        }}
                        // acciones={actionEnabled ? [
                        //   <Box
                        //     className=""
                        //     onClick={() => dispatch({
                        //       type: `onRemoveContactoEvento`,
                        //       payload: { 'codContacto': contacto?.codContacto },
                        //     })}
                        //   >
                        //     <Icon>delete</Icon>
                        //   </Box>,
                        // ] : []}
                        onClick={() => navigate(`/ss/contacto/${contacto.codContacto}`)}
                        alignActions="flex-end"
                        tr={contacto?.nombre ?? ""}
                        br={contacto?.email}
                        // tr={util.formatDate(curso?.fechaIni)}
                        tl={contacto?.telefono}
                      />
                    </Box>
                  );
                })}
              {/* </List> */}
            </InfiniteScroll>
          </Box>
        ) : (
          <Typography variant="spam" style={{ textAlign: "center", padding: "20px" }}>
            No hay contactos
          </Typography>
        )}
        <Divider />
      </QTitleBox>
    </Box >
  );
}
