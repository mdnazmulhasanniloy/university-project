"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import UTextArea from "@/components/Form/UTextArea";
import UUpload from "@/components/Form/UUpload";
import { useCreateCategoryMutation } from "@/redux/api/categoryApi";
import { imageFileSchema } from "@/schema/imageFileSchema";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal } from "antd";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const createCategoryValidationSchema = z.object({
  name: z
    .string({
      required_error: "Category Name is required",
    })
    .min(1, "Category Name is required"),
  description: z
    .string("Short description is required")
    .min(
      1,
      "A minimum short description is recommended for better user experience",
    ),
  image: imageFileSchema,
});

export default function CreateCategoryModal({ open, setOpen }) {
  const [createFn, { isLoading }] = useCreateCategoryMutation();

  const form = useForm();
  const handelSubmit = async (data) => {
    const { image, ...payload } = data;

    if (image?.length < 1) {
      ErrorModal("Please upload a category image!");
      return;
    }

    const formData = new FormData();
    formData.append("banner", image[0]?.originFileObj);
    formData.append("data", JSON.stringify(payload));

    try {
      delete data.image;
      const res = await createFn(formData).unwrap();

      SuccessModal(res?.message);
      if (res?.success) {
        form.reset();
        setOpen(false);
      }
    } catch (error) {
      ErrorModal(error?.message || error?.data?.message);
    }
  };
  return (
    <Modal
      centered
      open={open}
      setOpen={setOpen}
      footer={null}
      onCancel={() => {
        setOpen(false);
      }}
      title="Create Category"
    >
      <FormWrapper
        onSubmit={handelSubmit}
        resolver={zodResolver(createCategoryValidationSchema)}
      >
        <UUpload uploadTitle={"category image"} name={"image"} maxCount={1} />

        <UInput
          type="text"
          name="name"
          label="Category Name"
          required={true}
          placeholder="Enter category name"
        />

        <UTextArea
          name="description"
          label="Short description"
          placeholder={
            "Enter short description of the categories like what kind of services are usually provided under this category etc..."
          }
        />

        {isLoading ? (
          <Button disabled className="!h-10 w-full !font-semibold">
            <Loader className="mr-2 h-5 w-5 animate-spin" />
            Creating in...
          </Button>
        ) : (
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="w-full"
          >
            Submit
          </Button>
        )}
      </FormWrapper>
    </Modal>
  );
}
