
function InputField({
  label,
  type = "text",
  placeholder,
  required = false,
  children,
}) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && (
            <span className="ml-1 text-blue-600">*</span>
          )}
        </label>

        {children}
      </div>

      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="
          h-[42px] w-full rounded-lg
          border border-slate-200
          bg-white px-3.5
          text-sm text-slate-700
          placeholder:text-slate-400
          outline-none transition
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-100
        "
      />
    </div>
  );
}

export default InputField;
