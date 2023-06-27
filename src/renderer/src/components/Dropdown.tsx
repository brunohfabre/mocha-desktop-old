import clsx from 'clsx'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

function Root(props: DropdownMenu.DropdownMenuProps) {
  return <DropdownMenu.Root {...props} />
}

function Trigger(props: DropdownMenu.DropdownMenuTriggerProps) {
  return <DropdownMenu.Trigger {...props} />
}

function Content({
  className,
  ...props
}: DropdownMenu.DropdownMenuContentProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className={clsx(
          'bg-violet-200 flex flex-col w-48 py-2 z-10',
          className,
        )}
        {...props}
      />
    </DropdownMenu.Portal>
  )
}

function Item({ className, ...props }: DropdownMenu.DropdownMenuItemProps) {
  return (
    <DropdownMenu.Item
      className={clsx(
        'h-8 px-3 flex items-center text-sm hover:bg-violet-300 cursor-pointer',
        className,
      )}
      {...props}
    />
  )
}

export const Dropdown = {
  Root,
  Trigger,
  Content,
  Item,
}
