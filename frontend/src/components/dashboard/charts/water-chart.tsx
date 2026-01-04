import {
  ComposedChart,
  Bar,
  Cell,
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

export function WaterChart({ data, config, waterRange }: { data: any[], config: ChartConfig, waterRange?: { min: number; max: number } }) {
  const getColor = (value: number) => {
    if (!waterRange) return 'var(--color-waterPercentage)';
    if (value < waterRange.min) return 'rgba(0, 153, 251, 0.3)';
    if (value > waterRange.max) return 'rgba(255, 0, 0, 0.3)';
    return 'rgba(0, 255, 0, 0.3)';
  };

  const CustomTooltip = (props: any) => {
    const filteredPayload = props.payload?.filter((p: any) => p.name === 'Water %');
    return <ChartTooltipContent {...props} payload={filteredPayload} />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Water %
          {waterRange && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({waterRange.min.toFixed(1)} - {waterRange.max.toFixed(1)}%)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[340px] w-full">
          <ComposedChart
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
              tickFormatter={(value) => value.toFixed(1)}
              // domain={[40, 50]}
              domain={([dataMin, dataMax]) => [Math.floor(dataMin - 5), Math.ceil(dataMax + 5)]}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />
            {waterRange && (
              <ReferenceArea
                y1={waterRange.min}
                y2={waterRange.max}
                stroke="none"
                fill="var(--chart-range-area)"
                label={{ 
                  value: "Healthy Range", 
                  position: "insideTopRight", 
                  fill: "var(--chart-range-label)", 
                  fontSize: 12 
                }}
              />
            )}
            <Bar dataKey="waterPercentage" legendType="none">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.waterPercentage)} />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="waterPercentage"
              legendType="none"
              name="Water %"
              stroke="var(--color-waterPercentage)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
