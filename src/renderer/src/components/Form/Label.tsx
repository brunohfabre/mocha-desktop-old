interface LabelProps {
  name: string
  label: string
}

export function Label({ name, label }: LabelProps) {
  return (
    <label htmlFor={name} className="text-sm">
      {label}
    </label>
  )
}
