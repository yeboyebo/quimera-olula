import { List } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import { useStateValue, util } from "quimera";
import React, { useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { Box, QTitleBox } from "../";

function QListModel({
  data,
  disabled,
  ItemComponent,
  itemProps,
  modelName,
  title,
  scrollable,
  altoCabecera,
  ...props
}) {
  const [_, dispatch] = useStateValue();
  const callbackLineaCambiada = useCallback(payload => {
    dispatch({ type: `on${util.camelId(modelName)}ItemChanged`, payload });
  }, []);

  const altura = `calc(100vh - ${altoCabecera}px)`;

  if (!data) {
    return null;
  }
  console.log("DATA", data);
  // console.log("mimensaje_data", data.idList);

  return (
    <QTitleBox titulo={title}>
      {scrollable ? (
        <Box id={"scrollableBox" + util.camelId(modelName)} style={{ height: "auto", maxHeight: altura, overflow: "auto" }}>
          <InfiniteScroll
            dataLength={data.idList ? data?.idList?.length : 0}
            next={() => dispatch({ type: `onNext${util.camelId(modelName)}` })}
            hasMore={data?.page?.next !== null}
            loader={<h4>Loading...</h4>}
            scrollableTarget={"scrollableBox" + util.camelId(modelName)}
          >
            <List disablePadding dense>
              {data.idList?.map(id => {
                const item = data.dict[id];

                return (
                  <ItemComponent
                    key={id}
                    modelName={modelName}
                    model={item}
                    selected={id === data.current}
                    callbackChanged={callbackLineaCambiada}
                    disabled={disabled}
                    {...itemProps}
                  />
                );
              })}
            </List>
          </InfiniteScroll>
        </Box>
      ) : (
        <List disablePadding dense>
          {data.idList?.map(id => {
            const item = data.dict[id];

            return (
              <ItemComponent
                key={id}
                modelName={modelName}
                model={item}
                selected={id === data.current}
                callbackChanged={callbackLineaCambiada}
                disabled={disabled}
                {...itemProps}
              />
            );
          })}
        </List>
      )}
    </QTitleBox>
  );
}

QListModel.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  modelName: PropTypes.string,
  ItemComponent: PropTypes.elementType,
  itemProps: PropTypes.object,
  scrollable: PropTypes.bool,
  altoCabecera: PropTypes.number,
};

QListModel.defaultProps = {
  scrollable: false,
  altoCabecera: 190,
};

export default QListModel;
