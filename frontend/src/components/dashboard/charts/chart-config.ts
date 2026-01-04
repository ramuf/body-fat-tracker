import { ChartConfig } from "@/components/ui/chart"

export const chartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "var(--chart-1)",
  },
  muscleMass: {
    label: "Muscle Mass %",
    color: "var(--chart-2)",
  },
  bodyFat: {
    label: "Body Fat %",
    color: "var(--chart-3)",
  },
  waterPercentage: {
    label: "Water %",
    color: "var(--chart-main)",
  },
  bmi: {
    label: "BMI",
    color: "var(--chart-main)",
  },
  ffmi: {
    label: "FFMI",
    color: "var(--chart-main)",
  },
  bmr: {
    label: "BMR (kcal)",
    color: "var(--chart-main)",
  },
} satisfies ChartConfig
