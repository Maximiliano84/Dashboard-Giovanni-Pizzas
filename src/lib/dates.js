export function normalizeDate(date) {
  if (!date) return null;

  if (typeof date?.toDate === "function") {
    return date.toDate().toISOString().slice(0, 10);
  }

  if (date instanceof Date) {
    return date.toISOString().slice(0, 10);
  }

  if (typeof date === "string") {
    return date.slice(0, 10);
  }

  return null;
}

export function todayISO() {
  const d = new Date();
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
}

export function isSameDay(dateStr, today = todayISO()) {
  return dateStr === today;
}

export function isThisMonth(dateStr, today = todayISO()) {
  return dateStr?.slice(0, 7) === today.slice(0, 7);
}

export function isThisYear(dateStr, today = todayISO()) {
  return dateStr?.slice(0, 4) === today.slice(0, 4);
}

export function isThisWeek(dateStr) {
  if (!dateStr) return false;

  const today = new Date();
  const date = new Date(`${dateStr}T00:00:00`);
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  start.setDate(today.getDate() - today.getDay());

  return date >= start && date <= today;
}
