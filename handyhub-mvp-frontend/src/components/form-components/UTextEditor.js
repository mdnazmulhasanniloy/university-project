"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function UTextEditor({ name, label, placeholder, required }) {
  const { control } = useFormContext();

  const joditConfig = useMemo(
    () => ({
      height: 500,
      placeholder: placeholder || "Start typing...",
      // style: {
      //   fontSize: "20px",
      // },
      uploader: {
        insertImageAsBase64URI: true,
      },

      controls: {
        fontsize: {
          // list: Jodit.atom([
          //   8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28,
          //   30, 34, 38, 42, 44, 46, 50, 60, 70, 90, 100,
          // ]),
        },
      },
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "fontsize",
        "brush",
        "ul",
        "ol",
        "copyformat",
        "paragraph",
        "superscript",
        "subscript",
        "cut",
        "copy",
        "paste",
        "undo",
        "redo",
        "table",
        "lineHeight",
        "image",
        "preview",
      ],
      toolbarAdaptive: false,
    }),
    [placeholder],
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <JoditEditor
                value={field.value}
                config={joditConfig}
                onBlur={(content) => field.onChange(content)}
              />
            </div>
          </FormControl>
          <FormMessage className="text-danger" />
        </FormItem>
      )}
    />
  );
}
