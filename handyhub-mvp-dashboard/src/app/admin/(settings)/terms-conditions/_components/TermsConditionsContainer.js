"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import {
  useGetContentsQuery,
  useUpdateContentMutation,
} from "@/redux/api/contentApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import { Button } from "antd";
// import JoditEditor from "jodit-react";
import { Edit, Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

export default function TermsConditionsContainer() {
  const [content, setContent] = useState("");
  const editor = useRef(null);
  const { data: data, isSuccess } = useGetContentsQuery();
  const [updateFn, { isLoading }] = useUpdateContentMutation();
  const termsAndConditions = data?.data?.data[0]?.termsAndConditions || "";

  const onSubmit = async () => {
    try {
      const res = await updateFn({
        termsAndConditions: content,
      }).unwrap();
      if (res?.success) {
        SuccessModal("Terms and Conditions is updated");
      }
    } catch (error) {
      ErrorModal("Error updating Terms and Conditions");
    }
  };
  return (
    <section>
      <h3 className="mb-6 text-2xl font-semibold">Terms and Conditions</h3>

      <FormWrapper>
        <JoditEditor
          ref={editor}
          value={termsAndConditions}
          config={{
            height: 500,
            //@ts-ignore
            uploader: { insertImageAsBase64URI: true },
          }}
          onBlur={(newContent) => {
            setContent(newContent);
          }}
        />
        <div className="mt-5">
          {isLoading ? (
            <Button disabled className="!h-10 w-full !font-semibold">
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              Updating in...
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              onClick={onSubmit}
              className="w-full rounded-xl"
              icon={<Edit size={18} />}
            >
              Save Changes
            </Button>
          )}
        </div>
      </FormWrapper>
    </section>
  );
}
