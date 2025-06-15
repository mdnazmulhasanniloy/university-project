"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormContext, Controller } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Import Input component for text input

export default function URadioGroup({ name, label, items }) {
  const { control, setValue, watch } = useFormContext();

  // Watch the current value of the consultationType field
  const selectedValue = watch(name);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value); // Update the radio group value
                if (value !== "Others") {
                  setValue(name, value); // Reset the value if not "Others"
                }
              }}
              defaultValue={field.value}
              className="flex space-x-1"
            >
              {items?.map((item) => (
                <FormItem
                  key={item.value}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={item.value} className="!rounded" />
                  </FormControl>
                  <FormLabel className="cursor-pointer text-base font-normal">
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>

          {/* Conditionally render the input field if "Others" is selected */}
          {selectedValue === "Others" && (
            <FormControl>
              <FormItem>
                <Input
                  placeholder="Please specify timeline"
                  className="mt-2 border border-primary-blue"
                />
              </FormItem>
            </FormControl>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
