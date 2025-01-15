import { Box } from "@quimera/thirdparty";
import Quimera, { useWidth } from "quimera";
import React from "react";

function HeaderContainer({ useStyles }) {
  const width = useWidth();
  const mobile = ["xs", "sm"].includes(width);
  const headerHeight = mobile ? 50 : 60;

  return (
    <Quimera.Template id="HeaderContainer">
      <Box id="HeaderContainer" height={`${headerHeight}px`}>
        <Quimera.View id="Header" />
        <Quimera.View id="Dialog" />
      </Box>
    </Quimera.Template>
  );
}

HeaderContainer.propTypes = {};
HeaderContainer.defaultProps = {};

HeaderContainer.displayName = "HeaderContainer";
export default HeaderContainer;
