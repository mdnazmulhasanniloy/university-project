"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export function USearchSelect({
  name,
  label,
  placeholder,
  data = [],
  onChange,
  disabled = false,
}) {
  const { control } = useFormContext() ?? {};
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Popover open={showDropdown} onOpenChange={setShowDropdown}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "border-red w-full justify-between rounded-lg border border-gray-400 px-3 py-5 text-base font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  disabled={disabled}
                  onClick={() => setShowDropdown(true)}
                >
                  {typeof field?.value === "string" &&
                    data?.find((d) => d.value === field.value)?.label}

                  {typeof field?.value !== "string" &&
                    data?.find((d) => d.value === field.value?._id)?.label}

                  {!field?.value && (placeholder || "Select")}

                  {}

                  <CaretSortIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] border border-gray-400 p-0 font-dm-sans">
                <Command>
                  <CommandInput placeholder={"Search..."} />
                  <CommandList>
                    <CommandEmpty>No data found.</CommandEmpty>
                    <CommandGroup>
                      {data?.map((d) => (
                        <CommandItem
                          value={d.label}
                          key={d.value}
                          onSelect={() => {
                            field.onChange(
                              field.value === d.value ? "" : d.value,
                            );
                            if (onChange) onChange(d.value);
                            setShowDropdown(false);
                          }}
                        >
                          {d.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              d.value === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>

          <FormMessage className="text-danger" />
        </FormItem>
      )}
    />
  );
}
