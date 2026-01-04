"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format, parse, differenceInYears } from "date-fns"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { auth } from "@/lib/api"
import { User } from "@/types"

const profileSchema = z.object({
  full_name: z.string().optional(),
  birth_date: z.string().optional(),
  sex: z.string().optional(),
  height: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().optional()
  ),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm({ user, onSuccess }: { user: User; onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      full_name: user.full_name || "",
      birth_date: user.birth_date || "",
      sex: user.sex || "",
      height: user.height || undefined,
    },
  })

  const birthDate = form.watch("birth_date")
  const age = birthDate ? differenceInYears(new Date(), parse(birthDate, "yyyy-MM-dd", new Date())) : null

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    setMessage("")
    try {
      await auth.updateMe({
        full_name: data.full_name || null,
        birth_date: data.birth_date || null,
        sex: data.sex || null,
        height: data.height || null,
      })

      if (
        data.birth_date !== user.birth_date ||
        data.height !== user.height ||
        data.sex !== user.sex
      ) {
        await auth.recalculateMetrics()
        setMessage("Profile updated and metrics recalculated successfully!")
      } else {
        setMessage("Profile updated successfully!")
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error(error)
      setMessage("Failed to update profile.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Birth Date
                {age !== null && <span className="ml-2 text-muted-foreground font-normal">(Age: {age})</span>}
              </FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                  setDate={(date) =>
                    field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                  }
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sex</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (cm)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="175" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {message && <p className="text-sm font-medium">{message}</p>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}
