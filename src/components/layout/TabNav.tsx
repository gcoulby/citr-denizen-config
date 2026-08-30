import { TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface TabDef {
  value: string
  label: string
  signpost?: string
}

export function TabNav({ tabs }: { tabs: TabDef[] }) {
  return (
    <TabsList>
      {tabs.map((tab) => (
        <TabsTrigger key={tab.value} value={tab.value}>
          {tab.label}
          {tab.signpost && (
            <span className="ml-1.5 font-body text-[10px] font-normal uppercase tracking-widest text-ink-soft">
              {tab.signpost}
            </span>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
