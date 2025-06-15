"use client";

import { Controller } from "react-hook-form";
import { Form } from "antd";
// import JoditEditor, { Jodit } from "jodit-react";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

export default function UTextEditor({
  name,
  label,
  placeholder, 
}) {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error ? error.message : ""}
        >
          <JoditEditor
            {...field} 
            config={{
              height: 500,
              placeholder: placeholder,
              // controls: {
              //   font: {
              //     list: Jodit.atom({
              //       "General Sans": "General Sans",
              //     }),
              //   },
              // },
              uploader: {
                insertImageAsBase64URI: true,
              },
            }} 
          />
        </Form.Item>
      )}
    />
  );
}
