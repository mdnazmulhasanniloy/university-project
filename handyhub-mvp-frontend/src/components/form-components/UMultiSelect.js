"use client";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../ui/multiple-selector";

/**
 * Note: Below @param data is an array of objects containing label and value
 */
const UMultiSelect = ({
  name,
  label,
  placeholder,
  data,
  disabled,
  emptyText,
}) => {
  const { control } = useFormContext() ?? {};

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <MultiSelector
            onValuesChange={field.onChange}
            values={field.value || []}
          >
            <MultiSelectorTrigger>
              <MultiSelectorInput
                placeholder={placeholder}
                disabled={disabled}
              />
            </MultiSelectorTrigger>

            <MultiSelectorContent>
              <MultiSelectorList emptyText={emptyText}>
                {data?.map((item) => (
                  <MultiSelectorItem
                    key={item?.value}
                    value={item.value}
                    label={item.label}
                  >
                    {item.label}
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
        </FormItem>
      )}
    />
  );
};
export default UMultiSelect;
