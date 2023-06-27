import * as AlertDialog from '@radix-ui/react-alert-dialog'

import { Button } from '../Button'

interface AlertProps {
  open: boolean
  onOpenChange: (state: boolean) => void
  title: string
  description?: string
  actionText: string
  onAction: () => void
  onCancel?: () => void
  isLoading?: boolean
}

export function Alert({
  title,
  description,
  actionText,
  onAction,
  onCancel,
  isLoading,
  ...props
}: AlertProps) {
  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/50 fixed inset-0 z-50" />

        <AlertDialog.Content className="bg-white fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] focus:outline-none p-4 max-w-xs w-full flex flex-col gap-4 z-50">
          <div className="flex flex-col">
            <AlertDialog.Title className="font-medium">
              {title}
            </AlertDialog.Title>
            {description && (
              <AlertDialog.Description className="text-sm">
                {description}
              </AlertDialog.Description>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <AlertDialog.Cancel asChild onClick={onCancel}>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild onClick={onAction}>
              <Button type="button" variant="danger" isLoading={isLoading}>
                {actionText}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
