import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { formatARS, formatDateAR } from "../lib/api";
import { normalizeDate } from "../lib/dates";
import {
  buildTopVarieties,
  buildTrendData,
  filterByPeriod,
  getExpenseAmount,
  getSaleTotal,
} from "../lib/dashboardMetrics";

import { ShoppingCart, Wallet, Coins, Pizza, Receipt } from "lucide-react";
import { Button } from "../components/ui/button";
import StatCard from "../components/StatCard";
import { TrendChart, TopVarietiesChart } from "../components/Charts";
import { RecentSalesCard } from "../components/RecentSalesList";
import CierreCaja from "../components/CierreCaja";
import { DashboardSkeleton } from "../components/LoadingStates";

const PERIOD_LABEL = {
  today: "hoy",
  week: "esta semana",
  month: "este mes",
  year: "este año",
};

const PERIOD_OPTIONS = [
  { key: "today", label: "Hoy" },
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
  { key: "year", label: "Año" },
];

export default function Dashboard() {
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cierreOpen, setCierreOpen] = useState(false);
  const [period, setPeriod] = useState("today");

  const loadData = async () => {
    try {
      const [salesSnap, varSnap, expSnap] = await Promise.all([
        getDocs(collection(db, "sales")),
        getDocs(collection(db, "varieties")),
        getDocs(collection(db, "expenses")),
      ]);

      const varietiesData = varSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const salesData = salesSnap.docs.map((doc) => {
        const sale = doc.data();
        const variety = varietiesData.find((v) => v.id === sale.variety_id);
        const unit_price = Number(sale.unit_price || variety?.price || 0);
        const quantity = Number(sale.quantity || 0);

        return {
          id: doc.id,
          ...sale,
          variety_name: sale.variety_name || variety?.name || "Sin nombre",
          unit_price,
          quantity,
          total: Number(sale.total) || unit_price * quantity,
        };
      });

      const expensesData = expSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        amount: Number(doc.data().amount || 0),
      }));

      setSales(salesData);
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const ventasFiltradas = useMemo(
    () => filterByPeriod(sales, period),
    [sales, period]
  );

  const gastosFiltrados = useMemo(
    () => filterByPeriod(expenses, period),
    [expenses, period]
  );

  const metrics = useMemo(() => {
    const totalVentas = ventasFiltradas.reduce((acc, sale) => acc + getSaleTotal(sale), 0);
    const totalGastos = gastosFiltrados.reduce((acc, expense) => acc + getExpenseAmount(expense), 0);
    const pizzas = ventasFiltradas.reduce((acc, sale) => acc + Number(sale.quantity || 0), 0);

    return {
      totalVentas,
      totalGastos,
      ganancia: totalVentas - totalGastos,
      pizzas,
    };
  }, [ventasFiltradas, gastosFiltrados]);

  const trendData = useMemo(
    () => buildTrendData(ventasFiltradas, gastosFiltrados),
    [ventasFiltradas, gastosFiltrados]
  );

  const topVarieties = useMemo(
    () => buildTopVarieties(ventasFiltradas),
    [ventasFiltradas]
  );

  const recentSales = useMemo(
    () =>
      [...sales]
        .sort((a, b) => {
          const da = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at || normalizeDate(a.date));
          const db = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at || normalizeDate(b.date));
          return db - da;
        })
        .slice(0, 5),
    [sales]
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 fade-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-stone-500">
            Panel general
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-orange-600">
            Tu pizzería de un vistazo
          </h1>

          <div className="flex flex-wrap gap-2 mt-3">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => setPeriod(option.key)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  period === option.key
                    ? "bg-orange-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="text-sm text-stone-500">
            Hoy: {formatDateAR(new Date())}
          </div>

          <Button
            onClick={() => setCierreOpen(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Receipt className="w-4 h-4 mr-1" />
            Cierre de caja
          </Button>
        </div>
      </header>

      <CierreCaja open={cierreOpen} onOpenChange={setCierreOpen} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={`Ventas ${PERIOD_LABEL[period]}`}
          value={formatARS(metrics.totalVentas)}
          sub={`${ventasFiltradas.length} operaciones`}
          icon={ShoppingCart}
          accent="orange"
        />

        <StatCard
          label={`Gastos ${PERIOD_LABEL[period]}`}
          value={formatARS(metrics.totalGastos)}
          sub={`${gastosFiltrados.length} registrados`}
          icon={Wallet}
          accent="rose"
        />

        <StatCard
          label={`Ganancia ${PERIOD_LABEL[period]}`}
          value={formatARS(metrics.ganancia)}
          sub={
            metrics.ganancia > 0
              ? "Positivo"
              : metrics.ganancia < 0
                ? "Negativo"
                : "Sin movimientos"
          }
          icon={Coins}
          accent={
            metrics.ganancia > 0
              ? "emerald"
              : metrics.ganancia < 0
                ? "rose"
                : "amber"
          }
          trend={
            metrics.ganancia > 0
              ? "up"
              : metrics.ganancia < 0
                ? "down"
                : undefined
          }
        />

        <StatCard
          label={`Pizzas ${PERIOD_LABEL[period]}`}
          value={metrics.pizzas.toString()}
          sub="unidades"
          icon={Pizza}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <div className="lg:col-span-2 h-full">
          <TrendChart data={trendData} />
        </div>

        <div className="h-full">
          <TopVarietiesChart data={topVarieties} />
        </div>
      </div>

      <RecentSalesCard sales={recentSales} />
    </div>
  );
}
