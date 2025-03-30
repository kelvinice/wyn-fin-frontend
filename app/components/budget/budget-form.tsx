import type { UseFormRegister, UseFormWatch } from "react-hook-form";
import type { Classification } from "~/models/classification";

interface BudgetFormData {
    classificationId: string;
    amount: number;
    sourcePeriodId?: string;
}

interface BudgetFormProps {
    register: UseFormRegister<BudgetFormData>;
    watch: UseFormWatch<BudgetFormData>;
    isEditMode: boolean;
    availableClassifications: Classification[];
    getClassification: (id: string | number | undefined) => Classification | undefined;
    currency: string;
    isLoading?: boolean;
    periods?: { id: string; name: string }[];
    showCopyOptions?: boolean;
    currentClassificationId: string;
}

export function BudgetForm({
    register,
    watch,
    isEditMode,
    availableClassifications,
    getClassification,
    currency,
    isLoading = false,
    periods,
    showCopyOptions = false,
    currentClassificationId
}: BudgetFormProps) {
    return (
        <form className="space-y-4">
            {showCopyOptions && periods && periods.length > 0 && (
                <div>
                    <label className="label">
                        <span className="label-text font-medium">Copy from Period</span>
                    </label>
                    <select
                        className="select select-bordered w-full"
                        disabled={isLoading}
                        {...register("sourcePeriodId")}
                    >
                        <option value="">Don't copy - create manually</option>
                        {periods.map(period => (
                            <option key={period.id} value={period.id}>
                                {period.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        This will copy all budget allocations from the selected period
                    </p>
                </div>
            )}

            <div>
                <label className="label">
                    <span className="label-text font-medium">Classification</span>
                </label>
                {isEditMode ? (
                    <div className="flex items-center gap-2 p-2 border rounded-lg">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: getClassification(currentClassificationId)?.color || "#3b82f6" }}
                        ></div>
                        <span>{getClassification(currentClassificationId)?.name || "Unknown"}</span>
                    </div>
                ) : (
                    <select
                        className="select select-bordered w-full"
                        disabled={availableClassifications.length === 0 || isLoading}
                        {...register("classificationId", { required: true })}
                    >
                        {availableClassifications.map((classification) => (
                            <option
                                key={classification.secureId || classification.id}
                                value={classification.secureId || classification.id}
                            >
                                {classification.name}
                            </option>
                        ))}
                        {availableClassifications.length === 0 && (
                            <option value="">No available classifications</option>
                        )}
                    </select>
                )}
            </div>

            <div>
                <label className="label">
                    <span className="label-text font-medium">Budget Amount</span>
                </label>
                <div className="relative">
                    <span className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500">
                        {currency === 'IDR' ? 'Rp' : currency === 'USD' ? '$' : ''}
                    </span>
                    <input
                        type="number"
                        className="input input-bordered w-full pl-7"
                        min="0"
                        step={currency === 'IDR' ? "1000" : "0.01"}
                        disabled={isLoading}
                        {...register("amount", {
                            required: true,
                            valueAsNumber: true,
                            min: 0
                        })}
                    />
                </div>
            </div>

            <div className="pt-2">
                <p className="text-sm text-gray-500">
                    {isEditMode
                        ? "Update the budget allocation amount"
                        : "Allocate a budget amount to this classification"}
                </p>
            </div>
        </form>
    );
}

export type { BudgetFormData };