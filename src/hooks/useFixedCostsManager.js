import { useState, useCallback } from "react";
import { toast } from "sonner";

export default function useFixedCostsManager({
    fixedCosts,
    updateFixedCosts,
}) {
    const [openFixed, setOpenFixed] = useState(false);
    const [newFixed, setNewFixed] = useState("");
    const [toDeleteFixed, setToDeleteFixed] = useState(null);
    const [deletingFixed, setDeletingFixed] = useState(false);

    // ================= ADD =================

    const handleAddFixed = useCallback(async () => {
        const name = newFixed.trim();

        if (!name) return;

        try {
            await updateFixedCosts([
                ...fixedCosts,
                {
                    name,
                    cost: 0,
                },
            ]);

            setNewFixed("");
            setOpenFixed(false);
            toast.success("Costo fijo agregado");
        } catch (error) {
            console.error("Error agregando costo fijo:", error);
            toast.error("No se pudo agregar el costo fijo");
        }
    }, [newFixed, fixedCosts, updateFixedCosts]);

    // ================= UPDATE =================

    const handleUpdateFixed = useCallback(
        async (idx, value) => {
            try {
                const arr = [...fixedCosts];

                if (!arr[idx]) return;

                arr[idx] = {
                    ...arr[idx],
                    cost: value,
                };

                await updateFixedCosts(arr);
            } catch (error) {
                console.error("Error actualizando costo fijo:", error);
                toast.error("No se pudo actualizar el costo fijo");
            }
        },
        [fixedCosts, updateFixedCosts]
    );

    // ================= DELETE =================

    const handleDeleteFixed = useCallback((idx, name) => {
        setToDeleteFixed({
            index: idx,
            name,
        });
    }, []);

    const cancelDeleteFixed = useCallback(() => {
        if (deletingFixed) return;
        setToDeleteFixed(null);
    }, [deletingFixed]);

    const confirmDeleteFixed = useCallback(async () => {
        if (!toDeleteFixed) return;

        setDeletingFixed(true);

        try {
            const updated = fixedCosts.filter(
                (_, i) => i !== toDeleteFixed.index
            );

            await updateFixedCosts(updated);

            setToDeleteFixed(null);
            toast.success("Costo fijo eliminado");
        } catch (error) {
            console.error("Error eliminando costo fijo:", error);
            toast.error("No se pudo eliminar el costo fijo");
        } finally {
            setDeletingFixed(false);
        }
    }, [toDeleteFixed, fixedCosts, updateFixedCosts]);

    return {
        openFixed,
        setOpenFixed,

        newFixed,
        setNewFixed,

        toDeleteFixed,
        setToDeleteFixed,

        deletingFixed,

        handleAddFixed,
        handleUpdateFixed,
        handleDeleteFixed,
        cancelDeleteFixed,
        confirmDeleteFixed,
    };
}