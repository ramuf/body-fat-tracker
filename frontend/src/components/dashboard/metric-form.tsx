'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parse, differenceInYears } from 'date-fns';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { BodyMetricCreate, User } from '@/types';

const formSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  weight: z.coerce.number().min(1, "Weight must be greater than 0"),
  body_fat_percentage: z.coerce.number().min(0).max(100).optional(),
  muscle_mass: z.coerce.number().min(0).max(100).optional(),
  water_percentage: z.coerce.number().min(0).max(100).optional(),
  bmi: z.coerce.number().min(0).optional(),
  ffmi: z.coerce.number().min(0).optional(),
  bmr: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

interface MetricFormProps {
  onSubmit: (data: BodyMetricCreate) => void;
  isLoading?: boolean;
  defaultValues?: Partial<BodyMetricCreate>;
  user?: User;
}

export function MetricForm({ onSubmit, isLoading, defaultValues, user }: MetricFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      weight: 0,
      body_fat_percentage: 0,
      muscle_mass: 0,
      water_percentage: 0,
      bmi: 0,
      ffmi: 0,
      bmr: 0,
      notes: '',
      ...defaultValues,
    },
  });

  const weight = form.watch('weight');
  const bodyFat = form.watch('body_fat_percentage');

  const isProfileComplete = user?.height && user?.birth_date && user?.sex;

  useEffect(() => {
    if (!user || !weight) return;

    const heightM = (user.height || 0) / 100;
    if (heightM > 0) {
      // Calculate BMI
      const bmi = weight / (heightM * heightM);
      form.setValue('bmi', parseFloat(bmi.toFixed(1)));

      // Calculate FFMI if body fat is present
      if (bodyFat) {
        const fatFreeMass = weight * (1 - bodyFat / 100);
        const ffmi = fatFreeMass / (heightM * heightM);
        form.setValue('ffmi', parseFloat(ffmi.toFixed(1)));
      }
    }

    // Calculate BMR
    if (user.birth_date && user.sex && user.height) {
      const age = differenceInYears(new Date(), new Date(user.birth_date));
      let bmr = 0;
      // Mifflin-St Jeor Equation
      if (user.sex.toLowerCase() === 'male') {
        bmr = 10 * weight + 6.25 * user.height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * user.height - 5 * age - 161;
      }
      form.setValue('bmr', Math.round(bmr));
    }
  }, [weight, bodyFat, user, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Filter out 0 or empty values if they are optional in backend but required in form state
    const formattedValues: BodyMetricCreate = {
      date: values.date,
      weight: values.weight,
      body_fat_percentage: values.body_fat_percentage || undefined,
      muscle_mass: values.muscle_mass || undefined,
      water_percentage: values.water_percentage || undefined,
      bmi: values.bmi || undefined,
      ffmi: values.ffmi || undefined,
      bmr: values.bmr || undefined,
      notes: values.notes || undefined,
    };
    onSubmit(formattedValues);
    form.reset();
  };

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                  setDate={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!isProfileComplete && (
          <div className="bg-secondary/50 border border-secondary text-secondary-foreground px-4 py-3 rounded-md text-sm">
            <p className="font-medium">Complete your profile!</p>
            <p>
              To automatically calculate BMI, FFMI, and BMR, please update your{' '}
              <a href="/dashboard/profile" className="underline hover:text-primary">
                profile settings
              </a>{' '}
              with your height, sex, and birth date.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="body_fat_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body Fat %</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="water_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water %</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="muscle_mass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Muscle Mass %</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="bmi"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  BMI
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="w-[90vw] max-w-[400px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000]">
                      <p className="font-semibold mb-1">Body Mass Index</p>
                      <p className="mb-2">A simple screening tool to categorize weight status (underweight, healthy, overweight, obesity).</p>
                      <p className="text-xs text-muted-foreground">Note: It does not distinguish between muscle and fat mass.</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} readOnly className="bg-muted" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ffmi"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  FFMI
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="w-[90vw] max-w-[400px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000]">
                      <p className="font-semibold mb-1">Fat-Free Mass Index</p>
                      <p className="mb-2">Measures muscle mass relative to height. Unlike BMI, it accounts for body fat.</p>
                      <p className="text-xs text-muted-foreground">Useful for tracking actual muscle growth and lean body composition changes.</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} readOnly className="bg-muted" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bmr"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  BMR (kcal)
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="w-[90vw] max-w-[400px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000]">
                      <p className="font-semibold mb-1">Basal Metabolic Rate</p>
                      <p className="mb-2">The estimated calories your body burns at complete rest to maintain basic life functions.</p>
                      <p className="text-xs text-muted-foreground">Use this as a baseline for planning your calorie intake for weight loss or gain.</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...field} readOnly className="bg-muted" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Metric'}
        </Button>
      </form>
    </Form>
    </TooltipProvider>
  );
}
