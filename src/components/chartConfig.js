import { formatARS } from "../lib/api";

export const CHART_COLORS = ["#ea580c", "#16a34a", "#f59e0b", "#0ea5e9", "#9333ea", "#dc2626", "#0891b2"];

export const AREA_MARGIN = { left: 0, right: 8, top: 8, bottom: 0 };
export const BAR_MARGIN = { left: 8, right: 8 };
export const TOOLTIP_STYLE = { borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 };
export const PIE_TOOLTIP_STYLE = { borderRadius: 12, fontSize: 12 };
export const LEGEND_STYLE = { fontSize: 12 };
export const AXIS_TICK_X = { fontSize: 11, fill: "#78716c" };
export const AXIS_TICK_Y = { fontSize: 11, fill: "#78716c" };
export const AXIS_TICK_BAR_Y = { fontSize: 12, fill: "#44403c" };
export const AXIS_LINE_X = { stroke: "#e7e5e4" };
export const BAR_RADIUS = [0, 6, 6, 0];

export const formatTickDate = (v = "") => `${v.slice(8, 10)}/${v.slice(5, 7)}`;
export const formatTickAmount = (v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v);

export const trendTooltipFormatter = (value, name) => {
  const labels = {
    sales: "Ventas",
    expenses: "Gastos",
    profit: "Ganancia",
    Ventas: "Ventas",
    Gastos: "Gastos",
    Ganancia: "Ganancia",
  };

  return [formatARS(value), labels[name] || name];
};

export const topVarietiesFormatter = (value, _name, payload) => {
  const quantity = payload.payload.quantity;

  return [
    `${formatARS(value)} · ${quantity} ${quantity === 1 ? "unidad" : "unidades"}`,
    payload.payload.variety_name,
  ];
};

export const emptyLabelFormatter = () => "";
