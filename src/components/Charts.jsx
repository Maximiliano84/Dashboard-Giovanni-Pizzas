import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp } from "lucide-react";
import { formatARS, formatDateAR } from "../lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  AREA_MARGIN,
  BAR_MARGIN,
  TOOLTIP_STYLE,
  PIE_TOOLTIP_STYLE,
  LEGEND_STYLE,
  AXIS_TICK_X,
  AXIS_TICK_Y,
  AXIS_TICK_BAR_Y,
  AXIS_LINE_X,
  BAR_RADIUS,
  CHART_COLORS,
  formatTickDate,
  formatTickAmount,
  trendTooltipFormatter,
  topVarietiesFormatter,
  emptyLabelFormatter,
} from "./chartConfig";

export function TrendChart({ data, title = "Tendencia últimos 30 días", testid }) {
  const gradientSalesId = `g-sales-${testid}`;
  const gradientExpId = `g-exp-${testid}`;
  const gradientProfitId = `g-profit-${testid}`;
  return (
    <Card data-testid={testid}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-display text-base text-stone-800">{title}</CardTitle>
        <TrendingUp className="w-4 h-4 text-stone-400" />
      </CardHeader>
      <CardContent>
        <div className="w-full min-w-0 overflow-hidden">
          <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={300}>
            <AreaChart data={data} margin={AREA_MARGIN}>
              <defs>
                <linearGradient id={gradientSalesId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id={gradientExpId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id={gradientProfitId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f5f5f4" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatTickDate}
                tick={AXIS_TICK_X}
                axisLine={AXIS_LINE_X}
                tickLine={false}
                minTickGap={20}
              />
              <YAxis
                tick={AXIS_TICK_Y}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={formatTickAmount}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={trendTooltipFormatter}
                labelFormatter={formatDateAR}
              />
              <Area type="monotone" dataKey="sales" name="Ventas" stroke="#ea580c" strokeWidth={2} fill={`url(#${gradientSalesId})`} />
              <Area type="monotone" dataKey="expenses" name="Gastos" stroke="#dc2626" strokeWidth={2} fill={`url(#${gradientExpId})`} />
              <Area type="monotone" dataKey="profit" name="Ganancia" stroke="#10b981" strokeWidth={2.5} fill={`url(#${gradientProfitId})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TopVarietiesChart({ data, title = "Top variedades", testid }) {
  return (
    <Card className="h-full flex flex-col" data-testid={testid}>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-base text-stone-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {data.length === 0 ? (
          <ChartEmpty text="Aún no hay ventas." />
        ) : (
          <div className="w-full min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={300}>
              <BarChart data={data} layout="vertical" margin={BAR_MARGIN}>
                <CartesianGrid stroke="#f5f5f4" horizontal={false} />
                <XAxis type="number" tick={AXIS_TICK_X} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="variety_name" tick={AXIS_TICK_BAR_Y} axisLine={false} tickLine={false} width={90} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={topVarietiesFormatter}
                  labelFormatter={emptyLabelFormatter}
                />
                <Bar dataKey="total" radius={BAR_RADIUS}>
                  {data.map((entry, idx) => (
                    <Cell key={`${entry.variety_name}-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ExpensesPieChart({ data, title = "Gastos por categoría", testid }) {
  return (
    <Card data-testid={testid}>
      <CardHeader><CardTitle className="font-display text-base text-stone-800">{title}</CardTitle></CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <ChartEmpty text="Sin gastos cargados." />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300}>
              <PieChart>
                <Pie data={data} dataKey="amount" nameKey="category_name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {data.map((entry, idx) => (
                    <Cell key={entry.category_id} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatARS} contentStyle={PIE_TOOLTIP_STYLE} />
                <Legend wrapperStyle={LEGEND_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChartEmpty({ text }) {
  return <div className="h-64 min-h-[256px] flex items-center justify-center text-sm text-stone-400">{text}</div>;
}
