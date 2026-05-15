import { useCallback, useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { formatARS } from "../lib/api";
import { Trash2 } from "lucide-react";
import HistorialChart from "../components/HistorialChart";
import { TableSkeleton } from "../components/LoadingStates";

export default function Historial() {
  const [items, setItems] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isSingleDay = from && to && from === to;
  const hasFilters = from || to;

  // ---------- helpers ----------
  const normalizeDate = (d) => {
    if (!d) return null;
    if (d?.toDate) return d.toDate().toISOString().slice(0, 10);
    if (typeof d === "string") return d.slice(0, 10);
    return null;
  };

  // ---------- load desde Firebase ----------
  const loadData = useCallback(async () => {
    if (!hasFilters) {
      setItems([]);
      return;
    }

    setLoading(true);

    try {
      let salesQuery = collection(db, "sales");
      let expensesQuery = collection(db, "expenses");

      // 🔥 aplicar filtros reales
      if (from && to) {
        salesQuery = query(
          salesQuery,
          where("date", ">=", from),
          where("date", "<=", to)
        );

        expensesQuery = query(
          expensesQuery,
          where("date", ">=", from),
          where("date", "<=", to)
        );
      }

      const [salesSnap, expSnap] = await Promise.all([
        getDocs(salesQuery),
        getDocs(expensesQuery),
      ]);

      const sales = salesSnap.docs.map((docSnap) => {
        const d = docSnap.data();

        return {
          id: docSnap.id,
          type: "sale",
          name: d.variety_name || "Venta",
          quantity: d.quantity || 0,
          amount: d.total || 0,
          date: normalizeDate(d.date || d.created_at),
        };
      });

      const expenses = expSnap.docs.map((docSnap) => {
        const d = docSnap.data();

        return {
          id: docSnap.id,
          type: "expense",
          name: d.category_name || "Gasto",
          quantity: "-",
          amount: d.amount || 0,
          date: normalizeDate(d.date || d.created_at),
        };
      });

      const merged = [...sales, ...expenses].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setItems(merged);
    } catch (err) {
      console.error("Error cargando historial:", err);
    } finally {
      setLoading(false);
    }
  }, [from, to, hasFilters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---------- filtro tipo ----------
  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (typeFilter !== "all" && i.type !== typeFilter) return false;
      return true;
    });
  }, [items, typeFilter]);

  // ---------- resumen ----------
  const resumen = useMemo(() => {
    let ventas = 0;
    let gastos = 0;
    let pizzas = 0;

    filtered.forEach((i) => {
      if (i.type === "sale") {
        ventas += i.amount;
        pizzas += i.quantity || 0;
      } else {
        gastos += i.amount;
      }
    });

    return {
      ventas,
      gastos,
      ganancia: ventas - gastos,
      pizzas,
    };
  }, [filtered]);

  // ---------- eliminar ----------
  const remove = async (item) => {
    if (!item) return;

    setDeleting(true);

    try {
      const collectionName = item.type === "sale" ? "sales" : "expenses";

      await deleteDoc(doc(db, collectionName, item.id));

      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setRecordToDelete(null);
    } catch (err) {
      console.error("Error eliminando registro:", err);
    } finally {
      setDeleting(false);
    }
  };

  // ---------- chart ----------
  const chartData = useMemo(() => {
    const map = {};

    filtered.forEach((i) => {
      if (!i.date) return;

      if (!map[i.date]) {
        map[i.date] = {
          date: i.date,
          ventas: 0,
          gastos: 0,
        };
      }

      if (i.type === "sale") {
        map[i.date].ventas += i.amount;
      } else {
        map[i.date].gastos += i.amount;
      }
    });

    return Object.values(map)
      .map((d) => ({
        ...d,
        ganancia: d.ventas - d.gastos,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filtered]);

  // ---------- UI ----------
  return (
    <div className="space-y-6 fade-up">
      <h1 className="text-2xl font-bold">Historial</h1>

      {/* FILTROS */}
      <div className="bg-white border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-stone-500">Tipo</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="block w-full border rounded-lg px-3 py-1.5"
          >
            <option value="all">Todos</option>
            <option value="sale">Ventas</option>
            <option value="expense">Gastos</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-stone-500">Desde</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="block w-full border rounded-lg px-3 py-1.5"
          />
        </div>

        <div>
          <label className="text-xs text-stone-500">Hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="block w-full border rounded-lg px-3 py-1.5"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setTypeFilter("all");
            setFrom("");
            setTo("");
            setItems([]);
          }}
          className="text-sm text-stone-500 underline"
        >
          Limpiar
        </button>
      </div>

      {loading && hasFilters && <TableSkeleton rows={4} />}

      {/* RESUMEN */}
      {hasFilters && !loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Ventas"
              value={formatARS(resumen.ventas)}
              color="emerald"
            />

            <SummaryCard
              title="Gastos"
              value={formatARS(resumen.gastos)}
              color="rose"
            />

            <SummaryCard
              title="Ganancia"
              value={formatARS(resumen.ganancia)}
              color={
                resumen.ganancia > 0
                  ? "emerald"
                  : resumen.ganancia < 0
                    ? "rose"
                    : "amber"
              }
            />

            <SummaryCard
              title="Pizzas vendidas"
              value={resumen.pizzas.toString()}
              color="orange"
            />
          </div>

          <HistorialChart data={chartData} />
        </>
      )}

      {/* TABLA SOLO 1 DIA */}
      {isSingleDay && !loading && (
        <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="min-w-[560px] w-full text-sm">
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-b hover:bg-stone-50">
                  <td className="p-3">{i.name}</td>

                  <td className="p-3 text-right">{i.quantity}</td>

                  <td
                    className={`p-3 text-right font-semibold ${i.type === "sale"
                        ? "text-emerald-600"
                        : "text-rose-600"
                      }`}
                  >
                    {i.type === "sale"
                      ? `+ ${formatARS(i.amount)}`
                      : `- ${formatARS(i.amount)}`}
                  </td>

                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => setRecordToDelete(i)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-50"
                      aria-label="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-6 text-center text-stone-500">
              Sin resultados
            </div>
          )}
        </div>
      )}

      {!hasFilters && (
        <div className="text-center text-stone-400">
          Seleccioná una fecha para ver el historial
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {recordToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-history-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="space-y-2">
              <h2
                id="delete-history-title"
                className="text-lg font-bold text-stone-900"
              >
                Eliminar registro
              </h2>

              <p className="text-sm text-stone-500">
                Esta acción eliminará el registro del historial. No se puede
                deshacer.
              </p>
            </div>

            <div className="mt-4 rounded-xl border bg-stone-50 p-3 text-sm">
              <p className="font-medium text-stone-800">
                {recordToDelete.name}
              </p>

              <p className="mt-1 text-stone-500">
                {recordToDelete.type === "sale" ? "Venta" : "Gasto"} ·{" "}
                {formatARS(recordToDelete.amount)}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setRecordToDelete(null)}
                className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => remove(recordToDelete)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- card ----------
function SummaryCard({ title, value, color }) {
  const colors = {
    emerald: "text-emerald-600",
    rose: "text-rose-600",
    amber: "text-amber-600",
    orange: "text-orange-600",
  };

  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-xs text-stone-500">{title}</p>
      <p className={`text-xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}