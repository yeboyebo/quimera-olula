import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";

import { Box } from "../../";
import BaseField from "../BaseField";
import AutocompleteField from "./AutocompleteField";

function AutocompleteBase({
  async,
  id,
  timeout,
  minCharacters,
  getOptions,
  getOptionLabel,
  disableClearable,
  renderOption,
  value,
  onChange,
  options,
  ...props
}) {
  const [timer, setTimer] = useState();

  const updateOptions = useCallback(
    v => {
      if (v.length < minCharacters) {
        return;
      }
      if (getOptions) {
        getOptions(v);
      }
    },
    [getOptions, minCharacters],
  );

  const handleInputChange = useCallback(
    event => {
      if (value) {
        onChange && onChange(null);
      }
      const newval = event.target.value;
      clearTimeout(timer);
      setTimer(setTimeout(() => updateOptions(newval), timeout));
    },
    [updateOptions, onChange, timer, setTimer, timeout, value],
  );

  return (
    <Box width={1}>
      <BaseField
        id={id}
        Component={
          <AutocompleteField
            options={options}
            onInputChange={async ? handleInputChange : null}
            getOptionLabel={getOptionLabel}
            disableClearable={disableClearable}
            renderOption={renderOption}
          />
        }
        value={value}
        onChange={onChange}
        getEventValue={e => e.target?.value?.key ?? null}
        {...props}
      />
    </Box>
  );
}

AutocompleteBase.propTypes = {
  /** Id for reference */
  id: PropTypes.string.isRequired,
  /** Field for state update */
  field: PropTypes.string,
  /** Label for the field */
  label: PropTypes.string,
  /** Milliseconds before trigger */
  timeout: PropTypes.number,
  /** Minimun number of characters before trigger */
  minCharacters: PropTypes.number,
  /** Whether the control takes its properties from props (false) or an async function (true) */
  async: PropTypes.bool,
  /** Functión onChange. Si no se especifica se lanza un dispatch onIdChanged con el array de opciones seleccionado */
  onChange: PropTypes.func,
  getOptions: PropTypes.func,
  getOptionLabel: PropTypes.func,
  renderOption: PropTypes.func,
  disableClearable: PropTypes.bool,
  value: PropTypes.any,
  /** Options list for sync controls */
  options: PropTypes.array,
};

AutocompleteBase.defaultProps = {
  timeout: 500,
  minCharacters: 0,
  async: false,
};

export default AutocompleteBase;
