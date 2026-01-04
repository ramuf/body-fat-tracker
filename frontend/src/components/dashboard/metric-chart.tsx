import { useMemo } from 'react';
import ranges from '@/lib/bodyFatRanges.json'
import waterRanges from '@/lib/bodyWaterRanges.json'
import bmiFfmiRanges from '@/lib/bmiFfmiRanges.json'
import muscleMassRanges from '@/lib/muscleMassRanges.json'
import { User } from '@/types'
import { BodyMetric } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { chartConfig } from './charts/chart-config';
import { WeightChart } from './charts/weight-chart';
import { MuscleMassChart } from './charts/muscle-mass-chart';
import { BodyFatChart } from './charts/body-fat-chart';
import { BodyCompositionChart } from './charts/body-composition-chart';
import { WaterChart } from './charts/water-chart';
import { BmiChart } from './charts/bmi-chart';
import { FfmiChart } from './charts/ffmi-chart';
import { BmrChart } from './charts/bmr-chart';

interface MetricChartProps {
  metrics: BodyMetric[];
  user?: User | undefined;
}

export function MetricChart({ metrics, user }: MetricChartProps) {
  const userHealthyRange = useMemo(() => {
    if (!user || !user.sex) return undefined
    const birth = user.birth_date
    if (!birth) return undefined
    const birthDate = new Date(birth)
    const age = Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    let ageKey = ''
    if (age >= 20 && age <= 39) ageKey = '20-39'
    else if (age >= 40 && age <= 59) ageKey = '40-59'
    else ageKey = '60-79'
    const sexKey = user.sex === 'male' ? 'male' : 'female'
    // @ts-ignore
    const bucket = (ranges as any)[sexKey]?.[ageKey]
    if (!bucket) return undefined
    return { min: bucket.min, max: bucket.max }
  }, [user])

  const userWaterRange = useMemo(() => {
    if (!user || !user.sex) return undefined
    const sexKey = user.sex === 'male' ? 'male' : 'female'
    // @ts-ignore
    const range = (waterRanges as any)[sexKey]
    if (!range) return undefined
    return { min: range.min, max: range.max }
  }, [user])

  const bmiRange = useMemo(() => {
    return { min: bmiFfmiRanges.bmi.min, max: bmiFfmiRanges.bmi.max }
  }, [])

  const ffmiRange = useMemo(() => {
    if (!user || !user.sex) return undefined
    const sexKey = user.sex === 'male' ? 'male' : 'female'
    // @ts-ignore
    const range = (bmiFfmiRanges.ffmi as any)[sexKey]
    if (!range) return undefined
    return { min: range.min, max: range.max }
  }, [user])

  const muscleMassRange = useMemo(() => {
    if (!user || !user.sex || !user.birth_date) return undefined
    
    const birthDate = new Date(user.birth_date)
    const age = Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    
    let ageKey = ''
    if (age >= 18 && age <= 35) ageKey = '18-35'
    else if (age >= 36 && age <= 55) ageKey = '36-55'
    else if (age >= 56 && age <= 75) ageKey = '56-75'
    else if (age >= 76 && age <= 85) ageKey = '76-85'
    
    // Fallback for ages outside the specific ranges (optional, but good for UX)
    if (!ageKey) {
       if (age < 18) ageKey = '18-35' // Use youngest range for < 18
       else if (age > 85) ageKey = '76-85' // Use oldest range for > 85
    }

    const sexKey = user.sex === 'male' ? 'male' : 'female'
    // @ts-ignore
    const range = (muscleMassRanges as any)[sexKey]?.[ageKey]
    if (!range) return undefined
    
    return { min: range.min, max: range.max }
  }, [user])

  const chartData = useMemo(() => {
    // Create a copy and sort by date ascending for the chart
    return [...metrics]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((metric) => ({
        date: new Date(metric.date).toLocaleDateString(),
        weight: metric.weight,
        bodyFat: metric.body_fat_percentage,
        muscleMass: metric.muscle_mass,
        waterPercentage: metric.water_percentage,
        bmi: metric.bmi,
        ffmi: metric.ffmi,
        bmr: metric.bmr,
      }));
  }, [metrics]);

  if (metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] sm:h-[340px] flex items-center justify-center text-muted-foreground">
            No data available to display chart.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="weight-energy" className="w-full">
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Trends</CardTitle>
          <TabsList className="grid w-full sm:w-fit grid-cols-3 gap-1">
            <TabsTrigger value="weight-energy">Weight & Energy</TabsTrigger>
            <TabsTrigger value="composition">Composition</TabsTrigger>
            <TabsTrigger value="indexes">Indexes</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="weight-energy" className="space-y-2 mt-0">
            <div className="grid gap-2 md:grid-cols-2">
              <WeightChart data={chartData} config={chartConfig} />
              <BmrChart data={chartData} config={chartConfig} />
            </div>
          </TabsContent>

          <TabsContent value="composition" className="space-y-2">
            {/* <BodyCompositionChart 
              data={chartData} 
              config={chartConfig} 
              healthyRange={userHealthyRange}
              muscleMassRange={muscleMassRange}
            /> */}
            <div className="grid gap-2 md:grid-cols-2">
              <MuscleMassChart 
                data={chartData} 
                config={chartConfig} 
                muscleMassRange={muscleMassRange}
              />
              <BodyFatChart 
                data={chartData} 
                config={chartConfig} 
                healthyRange={userHealthyRange} 
              />
              <WaterChart 
                data={chartData} 
                config={chartConfig} 
                waterRange={userWaterRange}
              />
            </div>
          </TabsContent>

          <TabsContent value="indexes" className="space-y-2">
            <div className="grid gap-2 md:grid-cols-2">
              <BmiChart 
                data={chartData} 
                config={chartConfig} 
                bmiRange={bmiRange}
              />
              <FfmiChart 
                data={chartData} 
                config={chartConfig} 
                ffmiRange={ffmiRange}
              />
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}
