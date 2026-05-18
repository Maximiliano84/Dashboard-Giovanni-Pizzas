export default function ConfirmDeleteDialog({
    open,
    onClose,
    title = "Eliminar",
    description = "Esta acción no se puede deshacer.",
    onConfirm,
    confirmText = "Eliminar",
    cancelText = "Cancelar",
}) {
    if (!open) return null;

    const handleConfirm = async () => {
        if (typeof onConfirm === "function") {
            await onConfirm();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
                <div className="space-y-2">
                    <h2 className="text-lg font-bold text-stone-900">
                        {title}
                    </h2>

                    <p className="text-sm text-stone-500">
                        {description}
                    </p>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}