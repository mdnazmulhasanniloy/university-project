"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UTextEditor from "@/components/Form/UTextEditor";
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
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

export default function PrivacyPolicyContainer() {
  const [content, setContent] = useState("");
  const editor = useRef(null);
  const { data: privacyPolicyRes, isSuccess } = useGetContentsQuery();
  const [updateFn, { isLoading }] = useUpdateContentMutation();
  const privacyPolicyData =
    privacyPolicyRes?.data?.data[0]?.privacyPolicy || "";

  const onSubmit = async () => {
    try {
      const res = await updateFn({
        privacyPolicy: content,
      }).unwrap();
      if (res?.success) {
        SuccessModal("Privacy policy is updated");
      }
    } catch (error) {
      ErrorModal("Error updating privacy policy");
    }
  };

  return (
    <section>
      <h3 className="mb-6 text-2xl font-semibold">Privacy Policy</h3>

      <FormWrapper>
        <JoditEditor
          ref={editor}
          value={privacyPolicyData}
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
