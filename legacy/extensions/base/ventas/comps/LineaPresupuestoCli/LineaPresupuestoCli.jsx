import { ListItemLineaPedido } from "@quimera-extension/base-area_clientes";
import { QSection } from "@quimera/comps";
import Quimera from "quimera";

function LineaPresupuestoCli({ callbackChanged, disabled, key, linea, model, modelName, selected, variant = "form", ...props }) {
  const form = (
    <Quimera.View
      id="LineaPresupuestoCli"
      idLinea={model.idLinea}
      lineaInicial={model}
      disabled={disabled}
      callbackGuardada={callbackChanged}
    />
  );

  const listItem = (
    <ListItemLineaPedido key={key} selected={selected} model={model} modelName={modelName} />
  );

  const section = (
    <QSection
      actionPrefix={modelName}
      readOnly
      mt={0}
      p={0}
      ensureVisible
      alwaysInactive={!selected}
      focusStyle="listItem"
      collapsible={true}
      dynamicComp={() => form}
    >
      {listItem}
    </QSection>
  );

  const variants = {
    form,
    listItem,
    section,
  };

  return variants[variant];
}

export default LineaPresupuestoCli;
