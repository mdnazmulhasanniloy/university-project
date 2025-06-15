import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { TagInput } from "../ui/tags-input";
import { cn } from "@/lib/utils";

const UTagsInput = ({
  loading,
  label,
  labelClass,
  placeholder,
  name,
  defaultValue,
  className,
  disabled,
  onChange,
  tagsProp,
  data,
  ...props
}) => {
  const { control, setValue } = useFormContext() ?? {};
  const [tags, setTags] = useState(tagsProp || []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <TagInput
              {...field}
              placeholder={placeholder || "Enter a topic"}
              tags={tags}
              className={cn("h-11 border border-gray-400", className)}
              setTags={(newTags) => {
                setTags(newTags);
                setValue(name, newTags);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UTagsInput;
