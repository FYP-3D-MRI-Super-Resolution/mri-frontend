interface AuthInputProps {
  id: string
  name: string
  type: string
  label: string
  placeholder: string
  value: string
  autoComplete?: string
  onChange: (value: string) => void
}

const AuthInput = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  autoComplete,
  onChange,
}: AuthInputProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-dim mb-1">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition-colors"
    />
  </div>
)

export default AuthInput
