import clsx from 'clsx'

import * as ContextMenu from '@radix-ui/react-context-menu'

function Root(props: ContextMenu.ContextMenuProps) {
  return <ContextMenu.Root {...props} />
}

function Trigger(props: ContextMenu.ContextMenuTriggerProps) {
  return <ContextMenu.Trigger asChild {...props} />
}

function Content({ className, ...props }: ContextMenu.ContextMenuContentProps) {
  return (
    <ContextMenu.Portal>
      <ContextMenu.Content
        className={clsx(
          'bg-violet-200 flex flex-col w-48 py-2 z-10',
          className,
        )}
        {...props}
      />
    </ContextMenu.Portal>
  )
}

function Item({ className, ...props }: ContextMenu.ContextMenuItemProps) {
  return (
    <ContextMenu.Item
      className={clsx(
        'h-8 px-3 flex items-center text-sm hover:bg-violet-300 cursor-pointer',
        className,
      )}
      {...props}
    />
  )
}

export const Context = {
  Root,
  Trigger,
  Content,
  Item,
}
