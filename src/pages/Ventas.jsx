import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import NewSaleCard from "../components/NewSaleCard";
import SalesHistoryCard from "../components/SalesHistoryCard";
import { ListPageSkeleton } from "../components/LoadingStates";

const normalizeDate = (d) => {
  if (!d) return null;
  if (d?.toDate) return d.toDate().toISOString().slice(0, 10);
  if (typeof d === "string") return d.slice(0, 10);
  return null;
};

export default function Ventas() {
  const [varieties, setVarieties] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);

    try {
      const [varietiesSnap, salesSnap] = await Promise.all([
        getDocs(collection(db, "varieties")),
        getDocs(query(collection(db, "sales"), orderBy("created_at", "desc"))),
      ]);

      const varietiesData = varietiesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const today = new Date().toISOString().slice(0, 10);

      const salesData = salesSnap.docs
        .map((doc) => {
          const d = doc.data();
          const variety = varietiesData.find((v) => v.id === d.variety_id);
          const unit_price = Number(d.unit_price || variety?.price || 0);
          const quantity = Number(d.quantity || 0);

          return {
            id: doc.id,
            ...d,
            date: normalizeDate(d.date || d.created_at),
            variety_name: d.variety_name || variety?.name || "Sin nombre",
            unit_price,
            quantity,
            total: Number(d.total) || unit_price * quantity,
          };
        })
        .filter((sale) => sale.date === today);

      setVarieties(varietiesData);
      setSales(salesData);
    } catch (error) {
      console.error("Error cargando ventas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (loading) return <ListPageSkeleton />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ventas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <NewSaleCard varieties={varieties} onCreated={loadAll} />
        <SalesHistoryCard
          sales={sales}
          onDeleted={(id) => {
            setSales((prev) => prev.filter((s) => s.id !== id));
          }}
        />
      </div>
    </div>
  );
}
