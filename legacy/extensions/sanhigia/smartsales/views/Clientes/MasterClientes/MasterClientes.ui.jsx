import { Box, QBox, QListItem } from "@quimera/comps";
import { List } from "@quimera/thirdparty";
import Quimera, { useStateValue, useWidth } from "quimera";
import InfiniteScroll from "react-infinite-scroll-component";

const avatares = {
  "Cerrado": {
    icon: "",
    color: "#ef5350",
  },
  "En Preparacion": {
    icon: "",
    color: "#eb910c",
  },
  "En Curso": {
    icon: "",
    color: "#4caf50",
  },
};

function MasterClientes() {
  const [{ clientes }, dispatch] = useStateValue();

  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const anchoDetalle = mobile ? 1 : 0.5;
  const altura = `calc(100vh - ${170}px)`;

  // const botonesCabecera = [{ icon: "arrow_back", id: "atras", text: "Atrás" }];
  const botonesCabecera = [];
  const botones = [
    {
      icon: "filter_alt",
      id: "showFilter",
      text: "Mostrar filtro",
      badgeVisible: Object.keys(clientes.filter?.and ?? {}).length,
      badgeContent: Object.keys(clientes.filter?.and ?? {}).length,
    },
  ];
  console.log(clientes);

  return (
    <Quimera.Template id="MasterClientes">
      <Box width={anchoDetalle}>
        <QBox titulo="Clientes" botones={botones} botonesCabecera={botonesCabecera}>
          <Quimera.SubView id="Clientes/FilterClientes" />
          <Box id="scrollableBox" style={{ height: altura, overflow: "auto" }}>
            <InfiniteScroll
              dataLength={clientes.idList ? clientes?.idList?.length : 0}
              next={() => dispatch({ type: `onNextClientes` })}
              hasMore={clientes?.page?.next !== null}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableBox"
            >
              <List>
                {Object.values(clientes?.dict ?? {})?.map(cliente => {
                  return (
                    <QListItem
                      key={cliente?.codCurso}
                      onClick={() =>
                        dispatch({
                          type: "onClientesClicked",
                          payload: { item: cliente },
                        })
                      }
                      selected={cliente?.codCliente === clientes?.current?.toString()}
                      // avatar={avatares[cliente.nombre]}
                      tl={cliente?.nombre ?? ""}
                      // tr={cliente.estado}
                      // tr={util.formatDate(cliente?.fechaIni)}
                      // bl={util.formatDate(cliente?.fechaIni)}
                      bl={cliente.nombreAgente}
                    />
                  );
                })}
              </List>
            </InfiniteScroll>
          </Box>
        </QBox>
      </Box>
    </Quimera.Template>
  );
}

export default MasterClientes;
