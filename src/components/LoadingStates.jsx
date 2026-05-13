import { Pizza } from "lucide-react";

export function PageLoader({ title = "Cargando datos", description = "Preparando la información..." }) {
  return (
    <div className="min-h-[55vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
          <Pizza className="h-7 w-7 animate-pulse" />
        </div>
        <h2 className="text-lg font-bold text-stone-900">{title}</h2>
        <p className="mt-1 text-sm text-stone-500">{description}</p>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full w-1/2 animate-[loading-bar_1.2s_ease-in-out_infinite] rounded-full bg-orange-500" />
        </div>
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <div className="h-3 w-28 rounded-full bg-stone-200 animate-pulse" />
        <div className="h-8 w-72 max-w-full rounded-xl bg-stone-200 animate-pulse" />
        <div className="h-4 w-96 max-w-full rounded-full bg-stone-100 animate-pulse" />
      </div>
      <div className="h-10 w-40 rounded-xl bg-stone-200 animate-pulse" />
    </div>
  );
}

export function CardSkeleton({ className = "" }) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="h-3 w-24 rounded-full bg-stone-200 animate-pulse" />
          <div className="h-8 w-32 rounded-xl bg-stone-200 animate-pulse" />
          <div className="h-3 w-40 rounded-full bg-stone-100 animate-pulse" />
        </div>
        <div className="h-11 w-11 rounded-xl bg-orange-100 animate-pulse" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ className = "" }) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-5 flex items-center justify-between">
        <div className="h-5 w-44 rounded-full bg-stone-200 animate-pulse" />
        <div className="h-8 w-20 rounded-lg bg-stone-100 animate-pulse" />
      </div>
      <div className="flex h-56 items-end gap-3">
        {[38, 62, 45, 76, 54, 88, 66, 42].map((height, index) => (
          <div key={index} className="flex-1 rounded-t-xl bg-stone-100 animate-pulse" style={{ height: `${height}%` }} />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, className = "" }) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white shadow-sm ${className}`}>
      <div className="border-b border-stone-100 p-4">
        <div className="h-5 w-40 rounded-full bg-stone-200 animate-pulse" />
      </div>
      <div className="divide-y divide-stone-100">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 p-4">
            <div className="col-span-2 h-4 rounded-full bg-stone-100 animate-pulse" />
            <div className="h-4 rounded-full bg-stone-100 animate-pulse" />
            <div className="h-4 rounded-full bg-stone-100 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 fade-up">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartSkeleton className="lg:col-span-2" />
        <ChartSkeleton />
      </div>
      <TableSkeleton rows={4} />
    </div>
  );
}

export function ListPageSkeleton({ showForm = true }) {
  return (
    <div className="space-y-6 fade-up">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {showForm && <CardSkeleton className="min-h-72" />}
        <TableSkeleton rows={6} className={showForm ? "lg:col-span-2" : "lg:col-span-3"} />
      </div>
    </div>
  );
}
