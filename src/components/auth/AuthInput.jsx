import React from 'react';

export default function AuthInput({
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  autoComplete,
  required,
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-[#A7B0BD]">
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border bg-[#0C1015] px-3.5 py-2.5 text-xs text-[#F5F7FA] placeholder:text-[#596473] transition-colors focus:outline-none ${
          error ? 'border-[#A65D5D] focus:border-[#A65D5D]' : 'border-[#202731] focus:border-[#8294AA]'
        }`}
      />

      {error ? (
        <p className="text-xs text-[#A65D5D]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
