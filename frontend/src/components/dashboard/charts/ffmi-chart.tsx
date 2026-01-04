import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function FfmiChart({ data, config, ffmiRange }: { data: any[], config: ChartConfig, ffmiRange?: { min: number; max: number } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          FFMI
          {ffmiRange && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({ffmiRange.min.toFixed(1)} - {ffmiRange.max.toFixed(1)})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[340px] w-full">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 30]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {ffmiRange && (
              <ReferenceArea
                y1={ffmiRange.min}
                y2={ffmiRange.max}
                stroke="none"
                fill="var(--chart-range-area)"
                label={{ 
                  value: "FFMI Target", 
                  position: "insideBottomRight", 
                  fill: "var(--chart-range-label)", 
                  fontSize: 10 
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="ffmi"
              stroke="var(--color-ffmi)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
