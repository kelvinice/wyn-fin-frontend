import type { UseFormRegister, UseFormWatch, Control } from "react-hook-form";
import type { Classification } from "~/hooks/use-classification-service";
import type { SpendingFormData } from "./spending-management";
interface SpendingFormProps {
  register: UseFormRegister<SpendingFormData>;
  watch: UseFormWatch<SpendingFormData>;
  control: Control<SpendingFormData>;
  classifications: Classification[];
  isLoading: boolean;
  currency: string;
}

export function SpendingForm({
  register,
  watch,
  control,
  classifications,
  isLoading,
  currency
}: SpendingFormProps) {
  const selectedClassificationId = watch("classificationId");
  const selectedClassification = classifications.find(c => 
    c.secureId === selectedClassificationId || c.id?.toString() === selectedClassificationId
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text font-medium">Budget Category</span>
        </label>
        <select
          className="select select-bordered w-full"
          disabled={isLoading || classifications.length === 0}
          {...register("classificationId", { required: true })}
        >
          {classifications.length === 0 ? (
            <option value="">No categories available</option>
          ) : (
            <>
              <option value="" disabled>Select a category</option>
              {classifications.map(classification => (
                <option 
                  key={classification.secureId || classification.id} 
                  value={classification.secureId || classification.id}
                >
                  {classification.name}
                </option>
              ))}
            </>
          )}
        </select>
        
        {selectedClassification && (
          <div className="flex items-center gap-2 mt-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: selectedClassification.color || "#3b82f6" }}
            />
            <span className="text-sm text-gray-500">
              {selectedClassification.name}
            </span>
          </div>
        )}
      </div>
      
      <div>
        <label className="label">
          <span className="label-text font-medium">Description</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="E.g., Grocery shopping, Dinner out"
          {...register("description", { required: true })}
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="label">
          <span className="label-text font-medium">Amount</span>
        </label>
        <div className="relative flex gap-2 items-center">
          <span className="text-gray-500">
            {currency === 'IDR' ? 'Rp' : currency === 'USD' ? '$' : ''}
          </span>
          <input
            type="number"
            className="input input-bordered w-full"
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
      
      {/* Add date input field */}
      <div>
        <label className="label">
          <span className="label-text font-medium">Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full"
          disabled={isLoading}
          {...register("date")}
        />
      </div>
    </div>
  );
}