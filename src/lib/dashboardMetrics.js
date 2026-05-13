import { isSameDay, isThisMonth, isThisWeek, isThisYear, normalizeDate } from "./dates";

export function filterByPeriod(items, period) {
  return items.filter((item) => {
    const date = normalizeDate(item.date);
    if (!date) return false;

    if (period === "today") return isSameDay(date);
    if (period === "week") return isThisWeek(date);
    if (period === "month") return isThisMonth(date);
    if (period === "year") return isThisYear(date);

    return false;
  });
}

export function getSaleTotal(sale) {
  return Number(sale.total) || Number(sale.unit_price || 0) * Number(sale.quantity || 0);
}

export function getExpenseAmount(expense) {
  return Number(expense.amount || 0);
}

export function buildTrendData(sales = [], expenses = []) {
  const trendMap = {};

  const ensureDay = (date) => {
    if (!trendMap[date]) {
      trendMap[date] = { date, sales: 0, expenses: 0, profit: 0 };
    }
    return trendMap[date];
  };

  sales.forEach((sale) => {
    const date = normalizeDate(sale.date);
    if (!date) return;

    const day = ensureDay(date);
    day.sales += getSaleTotal(sale);
  });

  expenses.forEach((expense) => {
    const date = normalizeDate(expense.date);
    if (!date) return;

    const day = ensureDay(date);
    day.expenses += getExpenseAmount(expense);
  });

  return Object.values(trendMap)
    .map((day) => ({ ...day, profit: day.sales - day.expenses }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function buildTopVarieties(sales = [], limit = 5) {
  const topMap = {};

  sales.forEach((sale) => {
    const name = sale.variety_name || "Sin nombre";

    if (!topMap[name]) {
      topMap[name] = { quantity: 0, total: 0 };
    }

    topMap[name].quantity += Number(sale.quantity || 0);
    topMap[name].total += getSaleTotal(sale);
  });

  return Object.entries(topMap)
    .map(([variety_name, data]) => ({ variety_name, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}
