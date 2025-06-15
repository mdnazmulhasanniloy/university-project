// "use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/text-area";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

export default function UTextarea({
  name,
  label,
  max,
  className,
  placeholder,
  disabled,
  ref,
  ...props
}) {
  const { control } = useFormContext() ?? {};

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={cn("resize-none border border-gray-400", className)}
              maxLength={max}
              readOnly={props?.readOnly}
              disabled={disabled}
              ref={ref}
              {...field}
            />
          </FormControl>
          <FormMessage className="text-danger" />
        </FormItem>
      )}
    />
  );
}
