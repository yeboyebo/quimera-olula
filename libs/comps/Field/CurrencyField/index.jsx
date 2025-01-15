import PropTypes from "prop-types";
import React from "react";

import { Field } from "../";

function CurrencyField({ decimals, currency, ...props }) {
  return <Field.Float suffix={` ${currency}`} decimals={decimals} {...props} />;
}

CurrencyField.propTypes = {
  decimals: PropTypes.number,
  currency: PropTypes.string,
};

CurrencyField.defaultProps = {
  decimals: 2,
  currency: "€",
};

export default CurrencyField;
