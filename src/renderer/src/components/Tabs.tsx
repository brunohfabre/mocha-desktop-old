import * as RadixTabs from '@radix-ui/react-tabs'

function Root(props: RadixTabs.TabsProps) {
  return <RadixTabs.Root className="flex-1 flex flex-col" {...props} />
}

function List(props: RadixTabs.TabsListProps) {
  return <RadixTabs.List className="flex bg-blue-100" {...props} />
}

function Item(props: RadixTabs.TabsTriggerProps) {
  return (
    <RadixTabs.Trigger
      className="h-10 flex px-4 items-center text-sm hover:bg-blue-200 data-[state=active]:bg-blue-200"
      {...props}
    />
  )
}

function Content(props: RadixTabs.TabsContentProps) {
  return <RadixTabs.Content asChild {...props} />
}

export const Tabs = {
  Root,
  List,
  Item,
  Content,
}
