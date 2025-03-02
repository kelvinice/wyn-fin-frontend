import { UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
  useEnvelopeIcon?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

export function EmailInput({
  value,
  onChange,
  placeholder = "Enter your email",
  required = true,
  label = "Email",
  useEnvelopeIcon = true,
  readOnly = false,
  disabled = false
}: EmailInputProps) {
  const Icon = useEnvelopeIcon ? EnvelopeIcon : UserIcon;
  
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="relative group">
        <Icon className="z-10 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 
                        text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
        <input
          type="email"
          placeholder={placeholder}
          className={`input input-bordered pl-10 w-full 
                    focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
                    transition-all duration-200 ${readOnly ? 'bg-base-200/50' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
        />
      </div>
    </div>
  );
}