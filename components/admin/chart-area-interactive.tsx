"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/components/admin/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/admin/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/admin/ui/toggle-group"

export type ActivityPoint = { date: string; published: number; drafts: number }

const chartConfig = {
  activity: { label: 'Documents updated' },
  published: { label: 'Published', color: 'var(--chart-published)' },
  drafts: { label: 'Drafts', color: 'var(--chart-drafts)' },
} satisfies ChartConfig

export function ChartAreaInteractive({ data }: { data: ActivityPoint[] }) {
  const isMobile = useIsMobile()
  /* shadcn defaults this with an effect that syncs state to the breakpoint.
     Deriving it instead keeps the same behaviour (narrow screens start at 7d,
     an explicit choice wins) with no cascading render. */
  const [chosenRange, setTimeRange] = React.useState<string | null>(null)
  const timeRange = chosenRange ?? (isMobile ? "7d" : "90d")

  const filteredData = data.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  /* A new CMS has almost no history, so the area renders as a flat nothing and
     reads as a broken chart. Say what is actually true instead. */
  const daysWithActivity = filteredData.filter((d) => d.published + d.drafts > 0).length

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Editorial activity</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Documents created or updated in the CMS
          </span>
          <span className="@[540px]/card:hidden">Documents updated</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {daysWithActivity < 2 ? (
          <div className="flex h-[250px] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-center">
            <p className="text-sm font-medium">Not enough history yet</p>
            <p className="text-xs text-muted-foreground">
              {daysWithActivity === 0
                ? 'No documents were created or updated in this period.'
                : 'Activity so far lands on a single day. The trend fills in as you edit.'}
            </p>
          </div>
        ) : (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPublished" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-published)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-published)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDrafts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-drafts)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-drafts)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="drafts"
              type="natural"
              fill="url(#fillDrafts)"
              stroke="var(--color-drafts)"
              stackId="a"
            />
            <Area
              dataKey="published"
              type="natural"
              fill="url(#fillPublished)"
              stroke="var(--color-published)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
