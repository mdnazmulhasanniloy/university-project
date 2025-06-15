"use client";

import { useFormContext } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CalendarDatePicker from "../ui/calendar-date-picker";

export default function UDatePicker({
  name,
  label,
  disabledBeforeToday = false,
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-md font-normal">{label}</FormLabel>
          <FormControl className="w-full">
            <CalendarDatePicker
              field={field}
              disabledBeforeToday={disabledBeforeToday}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
