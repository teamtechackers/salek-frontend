import { STYLES } from "../../core/utils/typography/styles"

export default function FormField({
  id,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      {/* Label */}
      <label htmlFor={id} style={STYLES.field_label}>
        {label}
      </label>

      {/* Input */}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={STYLES.input_text}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                   outline-none transition-all"
      />
    </div>
  )
}
