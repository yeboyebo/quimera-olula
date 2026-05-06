import "./LoadingGif.style.scss";

import { useStateValue } from "quimera";
import React from "react";

function LoadingGif() {
  const [_state, _dispatch] = useStateValue();

  return (
    <div id="LoadingGif">
      <img alt="Project logo" src="/img/cargando-app.gif" />
    </div>
  );
}

export default LoadingGif;
