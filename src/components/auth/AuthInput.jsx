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
      <label htmlFor={id} className="block text-xs font-medium text-[#A7B0BC]">
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
        className={`w-full rounded-lg border bg-[#0D1118] px-3.5 py-2.5 text-xs text-[#F4F6F8] placeholder:text-[#687382] transition-colors focus:outline-none ${
          error ? 'border-[#B36262] focus:border-[#B36262]' : 'border-[#232B36] focus:border-[#7D91AA]'
        }`}
      />

      {error ? (
        <p className="text-xs text-[#B36262]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
