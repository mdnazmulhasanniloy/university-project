import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "../ui/PhoneInput";

export default function UPhoneInput({
  defaultValue,
  name,
  label,
  className,
  inputClassName,
  countrySelectClassName,
  placeholder,
  readOnly,
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col items-start">
          <FormLabel className="text-left">Phone Number</FormLabel>
          <FormControl className="w-full">
            <PhoneInput
              placeholder="Enter a phone number"
              international
              defaultCountry="US"
              className={className}
              inputClassName={inputClassName}
              countrySelectClassName={countrySelectClassName}
              value={field.value}
              onChange={field.onChange}
              readOnly={readOnly}
            />
          </FormControl>
          <FormMessage className="text-danger" />
        </FormItem>
      )}
    />
  );
}
