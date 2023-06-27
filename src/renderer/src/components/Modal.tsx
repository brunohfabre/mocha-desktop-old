import { ReactNode } from 'react'

import { X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'

import { IconButton } from './IconButton'

interface ModalProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  children: ReactNode
  title?: string
}

export function Modal({ open, onOpenChange, children, title }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0 z-50" />

        <Dialog.Content className="bg-white fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] focus:outline-none p-4 max-w-xl w-full flex flex-col gap-4 z-50">
          <header className="flex justify-between items-center">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close asChild>
              <IconButton type="button">
                <X weight="bold" />
              </IconButton>
            </Dialog.Close>
          </header>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
