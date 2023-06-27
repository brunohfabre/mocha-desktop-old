import { Button } from './Button'

interface EmptyProps {
  title: string
  description?: string
  actionText: string
  onAction: () => void
}

export function Empty({
  title,
  description,
  actionText,
  onAction,
}: EmptyProps) {
  return (
    <div className="flex-1 flex flex-col items-center gap-4 p-6 border-2 border-dashed">
      <div className="flex flex-col items-center">
        <strong className="text-base font-medium">{title}</strong>

        {description && <p className="text-sm">{description}</p>}
      </div>

      <Button onClick={onAction}>{actionText}</Button>
    </div>
  )
}
