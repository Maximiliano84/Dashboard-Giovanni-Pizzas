
import useCostsData from "../hooks/useCostsData";
import useIngredientManager from "../hooks/useIngredientManager";
import useFixedCostsManager from "../hooks/useFixedCostsManager";

import { formatARS } from "../lib/api";

import FixedCostsCard from "../components/costs/FixedCostsCard";
import FixedCostDialog from "../components/costs/FixedCostDialog";
import CostCard from "../components/costs/CostCard";
import CostsSummary from "../components/costs/CostsSummary";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import IngredientDialog from "../components/costs/IngredientDialog";
import { ListPageSkeleton } from "../components/LoadingStates";

export default function Costos() {
    const {
        varieties,
        recipes,
        fixedCosts,
        totalFixed,
        rentabilidad,
        updateRecipe,
        updateFixedCosts,
        getCost,
        loading,
    } = useCostsData();

    // ================= INGREDIENT MANAGER =================

    const {
        openAdd,
        setOpenAdd,

        newName,
        setNewName,

        toDeleteIngredient,
        setToDeleteIngredient,

        handleAddIngredient,
        handleOpenIngredientModal,
        handleIngredientCostChange,
        handleDeleteIngredient,
        confirmDeleteIngredient,
    } = useIngredientManager({
        recipes,
        updateRecipe,
    });

    // ================= FIXED COSTS MANAGER =================

    const {
        openFixed,
        setOpenFixed,

        newFixed,
        setNewFixed,

        toDeleteFixed,

        handleAddFixed,
        handleUpdateFixed,
        handleDeleteFixed,
        confirmDeleteFixed,
        deletingFixed,
        cancelDeleteFixed,
    } = useFixedCostsManager({
        fixedCosts,
        updateFixedCosts,
    });

    if (loading) return <ListPageSkeleton showForm={false} />;

    return (
        <div className="space-y-6 fade-up">
            <h1 className="text-2xl sm:text-3xl font-bold">
                Costos
            </h1>

            {/* RESUMEN */}

            <CostsSummary
                rentabilidad={rentabilidad}
            />

            {/* COSTOS FIJOS */}

            <FixedCostsCard
                fixedCosts={fixedCosts}
                totalFixed={totalFixed}
                formatARS={formatARS}
                onAdd={() =>
                    setOpenFixed(true)
                }
                onDelete={
                    handleDeleteFixed
                }
                onUpdate={
                    handleUpdateFixed
                }
            />

            {/* PIZZAS */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {varieties.map((v) => {
                    const items =
                        recipes[v.id]?.items || [];

                    const cost =
                        getCost(items);

                    return (
                        <CostCard
                            key={v.id}
                            variety={v}
                            items={items}
                            cost={cost}
                            onIngredientCostChange={(
                                idx,
                                value
                            ) =>
                                handleIngredientCostChange(
                                    v.id,
                                    items,
                                    idx,
                                    value
                                )
                            }
                            onDeleteIngredient={(
                                idx,
                                name
                            ) =>
                                handleDeleteIngredient(
                                    v.id,
                                    idx,
                                    name
                                )
                            }
                            onAddIngredient={() =>
                                handleOpenIngredientModal(
                                    v.id
                                )
                            }
                        />
                    );
                })}
            </div>

            {/* MODAL INGREDIENTE */}

            <IngredientDialog
                open={openAdd}
                onOpenChange={(value) => {
                    setOpenAdd(value);

                    if (!value) {
                        setNewName("");
                    }
                }}
                value={newName}
                onChange={setNewName}
                onConfirm={
                    handleAddIngredient
                }
            />

            {/* MODAL COSTO FIJO */}

            <FixedCostDialog
                open={openFixed}
                onOpenChange={(value) => {
                    setOpenFixed(value);

                    if (!value) {
                        setNewFixed("");
                    }
                }}
                value={newFixed}
                onChange={setNewFixed}
                onConfirm={handleAddFixed}
            />

            {/* DELETE INGREDIENTE */}

            <ConfirmDeleteDialog
                open={!!toDeleteIngredient}
                onClose={() =>
                    setToDeleteIngredient(
                        null
                    )
                }
                title="Eliminar ingrediente"
                description={`Eliminar "${toDeleteIngredient?.name}"`}
                onConfirm={
                    confirmDeleteIngredient
                }
            />

            {/* DELETE COSTO FIJO */}

            <ConfirmDeleteDialog
                open={!!toDeleteFixed}
                onClose={cancelDeleteFixed}
                title="Eliminar costo fijo"
                description={`Eliminar "${toDeleteFixed?.name}"`}
                onConfirm={confirmDeleteFixed}
                loading={deletingFixed}
            />
        </div>
    );
}