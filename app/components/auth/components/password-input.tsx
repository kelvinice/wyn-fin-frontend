import { useState } from "react";
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  label?: string;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = "Enter your password",
  required = true,
  minLength,
  label = "Password",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="relative group">
        <LockClosedIcon className="z-10 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 
                                text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="input input-bordered pl-10 pr-10 w-full
                    focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
                    transition-all duration-200"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full
                     hover:bg-primary/10 active:bg-primary/20 transition-colors duration-200"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-primary" />
          ) : (
            <EyeIcon className="w-5 h-5 text-gray-400 hover:text-primary" />
          )}
        </button>
      </div>
    </div>
  );
}