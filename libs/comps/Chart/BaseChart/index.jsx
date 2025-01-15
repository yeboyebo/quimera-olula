import { Chart, ChartAnnotation } from "@quimera/thirdparty";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

function BaseChart({ type, labels, data, title, color, chartProps, ...props }) {
  const chartRef = useRef(null);
  const [currentChart, setCurrentChart] = useState(null);

  function loadChart() {
    if (chartRef.current) {
      let myChart = currentChart;
      if (myChart !== null) {
        myChart.destroy();
      }
      chartProps.plugins = [ChartAnnotation];
      myChart = new Chart(chartRef.current, {
        type,
        data: {
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor: color,
            },
          ],
        },
        plugins: [ChartAnnotation],
        ...chartProps,
      });
      setCurrentChart(myChart);
    }
  }

  useEffect(() => {
    loadChart();
  }, [data, chartProps]);

  return (
    <div className="chart-container" style={{ height: "100%", width: "100%" }}>
      <canvas id="chart" ref={chartRef} {...props}>
        {"No se cargaron los datos"}
      </canvas>
    </div>
  );
}

BaseChart.propTypes = {
  /** Type of the chart */
  type: PropTypes.string.isRequired,
  /** Data labels */
  labels: PropTypes.array,
  /** Default dataset's Data */
  data: PropTypes.array,
  /** Default dataset's Title */
  title: PropTypes.string,
  /** Default dataset's title */
  color: PropTypes.string,
  /** Props to pass through */
  chartProps: PropTypes.object,
};

BaseChart.defaultProps = {
  type: "bar",
  labels: [],
  data: [],
  title: "",
  chartProps: {},
  color: "#771111",
};

export default BaseChart;
