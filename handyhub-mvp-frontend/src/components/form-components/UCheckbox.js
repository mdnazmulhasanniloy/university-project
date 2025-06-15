import React from "react";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

export default function UCheckbox({ name, label, className, ...props }) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-row items-center space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                className={className}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>

            <FormLabel className={cn("leading-none", className)}>
              {label}
            </FormLabel>
          </div>

          <FormMessage
            className="ml-6 inline-block text-danger"
            style={{ marginTop: 4, paddingInline: 4 }}
          />
        </FormItem>
      )}
    />
  );
}
