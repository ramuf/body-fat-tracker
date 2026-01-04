import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
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

export function BodyCompositionChart({ data, config, healthyRange, muscleMassRange }: { 
  data: any[], 
  config: ChartConfig, 
  healthyRange?: { min: number; max: number },
  muscleMassRange?: { min: number; max: number }
}) {
  // Determine gradient colors based on latest values vs healthy ranges
  const latestData = data[data.length - 1];
  const bodyFatStatus = latestData?.bodyFat !== undefined && healthyRange 
    ? (latestData.bodyFat < healthyRange.min ? 'below' : latestData.bodyFat > healthyRange.max ? 'above' : 'normal')
    : 'normal';
  const muscleMassStatus = latestData?.muscleMass !== undefined && muscleMassRange
    ? (latestData.muscleMass < muscleMassRange.min ? 'below' : latestData.muscleMass > muscleMassRange.max ? 'above' : 'normal')
    : 'normal';

  const getGradientColors = (status: 'below' | 'above' | 'normal') => {
    switch (status) {
      case 'below':
        return { start: '#3b82f6', end: '#1e40af' }; // Blue gradient for below range
      case 'above':
        return { start: '#ef4444', end: '#dc2626' }; // Red gradient for above range
      default:
        return { start: 'var(--color-bodyFat)', end: 'var(--color-bodyFat)' }; // Default theme color
    }
  };

  const bodyFatColors = getGradientColors(bodyFatStatus);
  const muscleMassColors = getGradientColors(muscleMassStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Body Composition Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[340px] w-full">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-weight)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-weight)" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="bodyFatGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={bodyFatColors.start} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={bodyFatColors.end} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="muscleMassGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={muscleMassColors.start} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={muscleMassColors.end} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="weight"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={([dataMin, dataMax]) => [Math.floor(dataMin - 5), Math.ceil(dataMax + 5)]}
              label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="percentage"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 60]}
              label={{ value: 'Percentage (%)', angle: 90, position: 'insideRight' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<CustomLegend healthyRange={healthyRange} muscleMassRange={muscleMassRange} bodyFatStatus={bodyFatStatus} muscleMassStatus={muscleMassStatus} />} />
            <Area
              yAxisId="weight"
              type="monotone"
              dataKey="weight"
              stroke="var(--color-weight)"
              fill="url(#weightGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              name="Weight"
            />
            <Area
              yAxisId="percentage"
              type="monotone"
              dataKey="bodyFat"
              stroke={bodyFatColors.start}
              fill="url(#bodyFatGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              name="Body Fat %"
            />
            <Area
              yAxisId="percentage"
              type="monotone"
              dataKey="muscleMass"
              stroke={muscleMassColors.start}
              fill="url(#muscleMassGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              name="Muscle Mass %"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function CustomLegend({ healthyRange, muscleMassRange, bodyFatStatus, muscleMassStatus }: { 
  healthyRange?: { min: number; max: number },
  muscleMassRange?: { min: number; max: number },
  bodyFatStatus: 'below' | 'above' | 'normal',
  muscleMassStatus: 'below' | 'above' | 'normal'
}) {
  const getStatusColor = (status: 'below' | 'above' | 'normal') => {
    switch (status) {
      case 'below': return '#3b82f6'; // Blue
      case 'above': return '#ef4444'; // Red
      default: return 'var(--color-bodyFat)'; // Default
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 pt-3">
      <div className="flex items-center gap-1.5">
        <div
          className="h-2 w-2 shrink-0 rounded-[2px]"
          style={{ backgroundColor: "var(--color-weight)" }}
        />
        <span className="text-muted-foreground text-sm">Weight</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className="h-2 w-2 shrink-0 rounded-[2px]"
          style={{ backgroundColor: getStatusColor(bodyFatStatus) }}
        />
        <span className="text-muted-foreground text-sm">
          Body Fat % {healthyRange && `(${healthyRange.min.toFixed(1)}-${healthyRange.max.toFixed(1)}%)`}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className="h-2 w-2 shrink-0 rounded-[2px]"
          style={{ backgroundColor: getStatusColor(muscleMassStatus) }}
        />
        <span className="text-muted-foreground text-sm">
          Muscle Mass % {muscleMassRange && `(${muscleMassRange.min.toFixed(1)}-${muscleMassRange.max.toFixed(1)}%)`}
        </span>
      </div>
    </div>
  );
}