import React, { useState, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./chart.module.css";
import Axios from "../services/axios";
import { CHART_COLORS, HIST_PARAMS, HOLDING_TYPE } from "../utils/constants";

const ChartPeriods = ({ setRange, range }) => {
  return (
    <ToggleButtonGroup
      className={styles.buttonGroup}
      type="radio"
      value={range}
      onChange={(value) => setRange(value)}
      name="ranges"
    >
      <ToggleButton
        id="today"
        variant="outline-secondary"
        value={HIST_PARAMS["1D"]}
      >
        Today
      </ToggleButton>
      <ToggleButton
        id="week"
        variant="outline-secondary"
        value={HIST_PARAMS["1W"]}
      >
        Week
      </ToggleButton>
      <ToggleButton
        id="1month"
        variant="outline-secondary"
        value={HIST_PARAMS["1M"]}
      >
        1 Month
      </ToggleButton>
      <ToggleButton
        id="6months"
        variant="outline-secondary"
        value={HIST_PARAMS["6M"]}
      >
        6 Months
      </ToggleButton>
      <ToggleButton
        id="yeartodate"
        variant="outline-secondary"
        value={HIST_PARAMS.YTD}
      >
        Year to date
      </ToggleButton>
      <ToggleButton
        id="1year"
        variant="outline-secondary"
        value={HIST_PARAMS["1Y"]}
      >
        1 Year
      </ToggleButton>
      <ToggleButton
        id="5years"
        variant="outline-secondary"
        value={HIST_PARAMS["5Y"]}
      >
        5 Years
      </ToggleButton>
      <ToggleButton
        id="alltime"
        variant="outline-secondary"
        value={HIST_PARAMS.MAX}
      >
        All time
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
// valid_ranges = [
//   "1d",
//   "5d",
//   "1mo",
//   "3mo",
//   "6mo",
//   "1y",
//   "2y",
//   "5y",
//   "10y",
//   "ytd",
//   "max",
// ];
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const plugins = [
  {
    afterDraw: (chart) => {
      if (chart.tooltip?._active?.length) {
        let x = chart.tooltip._active[0].element.x;
        let yAxis = chart.scales.y;
        let ctx = chart.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, yAxis.top);
        ctx.lineTo(x, yAxis.bottom);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ff0000";
        ctx.stroke();
        ctx.restore();
      }
    },
  },
];
const options = {
  interaction: {
    mode: "index",
    intersect: false,
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
  },
};

const getDataset = (type, historyData, color) => {
  return {
    label: type,
    data: historyData.map((d) => d["sum"][type]),
    borderColor: color,
    backgroundColor: color,
  };
};

function Chart({ type, range, setRange }) {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    new Axios().fetchHistory(range).then((response) => {
      setHistoryData(response.data);
    });
  }, [range]);

  const options1 = {
    // weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("en-US", options1);
  const labels = historyData.map((d) =>
    new Date(d["date"]).toLocaleString("en-US", { timeZone: "America/Toronto" })
  );

  let datasets = [];
  if (type === "all") {
    Object.values(HOLDING_TYPE).forEach((type) =>
      datasets.push(getDataset(type, historyData, CHART_COLORS[type]))
    );
  } else {
    datasets.push(getDataset(type, historyData, CHART_COLORS[type]));
  }

  const data = {
    labels,
    datasets: datasets,
  };
  return (
    <div className={styles.chartBox}>
      <Line
        options={options}
        plugins={plugins}
        data={data}
        className={styles.chart}
      />
      <ChartPeriods {...{ setRange, range }}></ChartPeriods>
    </div>
  );
}

export default Chart;
