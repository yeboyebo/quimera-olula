import { Box } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

function ListInfiniteScroll({
  next,
  hasMore,
  children,
  scrollableTarget,
  infiniteScrollProps,
  loader,
  ...props
}) {
  const dataLength = Array.isArray(children) ? children.length : 0;

  return (
    <Box id="scrollableDiv" height="100%" overflow="auto" {...props}>
      <InfiniteScroll
        dataLength={dataLength}
        next={next}
        hasMore={hasMore}
        loader={loader || <h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b></b>
          </p>
        }
        scrollableTarget={!!scrollableTarget && scrollableTarget}
        // Quitar scrollableTarget='scrollableDiv' para que depende del scroll principal de la pantalla
        {...infiniteScrollProps}
      >
        {children}
      </InfiniteScroll>
    </Box>
  );
}

ListInfiniteScroll.propTypes = {
  next: PropTypes.func,
  hasMore: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element),
  scrollableTarget: PropTypes.string,
  infiniteScrollProps: PropTypes.any,
  loader: PropTypes.any,
};

ListInfiniteScroll.defaultProps = {
  scrollableTarget: false,
};

export default ListInfiniteScroll;
