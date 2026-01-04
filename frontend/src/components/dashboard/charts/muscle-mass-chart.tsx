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

export function MuscleMassChart({ data, config, muscleMassRange }: { data: any[], config: ChartConfig, muscleMassRange?: { min: number; max: number } }) {
  const getColor = (value: number) => {
    if (!muscleMassRange) return 'var(--color-muscleMass)';
    if (value < muscleMassRange.min) return 'rgba(0, 153, 251, 0.3)';
    if (value > muscleMassRange.max) return 'rgba(255, 0, 0, 0.3)';
    return 'rgba(0, 255, 0, 0.3)';
  };

  const CustomTooltip = (props: any) => {
    const filteredPayload = props.payload?.filter((p: any) => p.name === 'Muscle Mass %');
    return <ChartTooltipContent {...props} payload={filteredPayload} />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Muscle Mass %
          {muscleMassRange && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({muscleMassRange.min.toFixed(1)} - {muscleMassRange.max.toFixed(1)}%)
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
              domain={[10, 40]}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <ChartLegend content={<ChartLegendContent />} />
            {muscleMassRange && (
              <ReferenceArea
                y1={muscleMassRange.min}
                y2={muscleMassRange.max}
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
            <Bar dataKey="muscleMass" legendType="none">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.muscleMass)} />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="muscleMass"
              legendType="none"
              name="Muscle Mass %"
              stroke="var(--color-muscleMass)"
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
