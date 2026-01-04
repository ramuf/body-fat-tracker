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

export function BmiChart({ data, config, bmiRange }: { data: any[], config: ChartConfig, bmiRange?: { min: number; max: number } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          BMI
          {bmiRange && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({bmiRange.min.toFixed(1)} - {bmiRange.max.toFixed(1)})
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
              domain={[15, 35]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {bmiRange && (
              <ReferenceArea
                y1={bmiRange.min}
                y2={bmiRange.max}
                stroke="none"
                fill="var(--chart-range-area)"
                label={{ 
                  value: "BMI Normal", 
                  position: "insideTopLeft", 
                  fill: "var(--chart-range-label)", 
                  fontSize: 10 
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="bmi"
              stroke="var(--color-bmi)"
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
