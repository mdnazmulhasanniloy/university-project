// import { useUploadFile } from "@/hooks/use-upload-file";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FileUploader } from "../ui/file-uploader";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";

export default function UUpload({
  name,
  label,
  maxSize = 10,
  maxFileCount = 4,
  className,
}) {
  const { control } = useFormContext() ?? {};

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className={cn("space-y-6", className)}>
          <FormItem className="w-full">
            <FormLabel>{label}</FormLabel>

            <FormControl>
              <FileUploader
                value={field.value}
                onValueChange={field.onChange}
                maxFileCount={maxFileCount}
                maxSize={maxSize * 1024 * 1024} // default 10 MB
              />
            </FormControl>
            <FormMessage className="text-danger" />
          </FormItem>
        </div>
      )}
    />
  );
}
