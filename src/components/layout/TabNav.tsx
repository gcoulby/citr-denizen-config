import { TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface TabDef {
  value: string
  label: string
}

export function TabNav({ tabs }: { tabs: TabDef[] }) {
  return (
    <TabsList>
      {tabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
