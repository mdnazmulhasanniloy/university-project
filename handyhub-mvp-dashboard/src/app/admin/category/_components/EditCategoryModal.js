"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { Button, Modal } from "antd";
import { Loader, Plus } from "lucide-react";
import UUpload from "@/components/Form/UUpload";
import { useUpdateCategoryMutation } from "@/redux/api/categoryApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import toast from "react-hot-toast";
import UTextArea from "@/components/Form/UTextArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { imageFileSchema } from "@/schema/imageFileSchema";

const editCategoryValidationSchema = z.object({
  name: z
    .string({
      required_error: "Category Name is required",
    })
    .min(1, "Category Name is required"),
  description: z
    .string({
      required_error: "Short description is required",
    })
    .min(
      1,
      "A minimum short description is recommended for better user experience",
    ),
  image: imageFileSchema,
});

export default function EditCategoryModal({
  open,
  setOpen,
  modalData,
  setModalData,
  refetchCategory,
}) {
  const categoryBannerFileList = [
    {
      uid: "-1",
      name: "category_banner",
      status: "done",
      url: modalData?.banner,
    },
  ];

  const [updateFn, { isLoading }] = useUpdateCategoryMutation();

  const handelSubmit = async (data) => {
    const { image, ...payload } = data;

    const formData = new FormData();

    if (data?.image?.length > 0) {
      if (image[0]?.originFileObj) {
        formData.append("banner", image[0]?.originFileObj);
      }
    }

    if (payload) formData.append("data", JSON.stringify(payload));
    try {
      const res = await updateFn({
        id: modalData?._id,
        data: formData,
      }).unwrap();
      SuccessModal(res?.message);

      if (res?.success) {
        setModalData(null);
        setOpen(false);
        refetchCategory();
      }
    } catch (error) {
      ErrorModal(error?.message || error?.data?.message);
    } finally {
      toast.dismiss("category");
    }
  };

  if (!modalData) return null;

  const defaultValues = {
    name: modalData?.name,
    description: modalData?.description,
    image: categoryBannerFileList,
  };

  return (
    <Modal
      centered
      open={open}
      setOpen={setOpen}
      footer={null}
      onCancel={() => {
        setOpen(false);
        setModalData(null);
      }}
      title="Edit Category"
    >
      <FormWrapper
        onSubmit={handelSubmit}
        defaultValues={defaultValues}
        resolver={zodResolver(editCategoryValidationSchema)}
      >
        <UUpload
          uploadTitle={"category image"}
          name={"image"}
          maxCount={1}
          fileList={categoryBannerFileList}
        />
        <UInput
          type="text"
          name="name"
          label="Category Name"
          placeholder={"Enter category name"}
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
            Updating in...
          </Button>
        ) : (
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="w-full"
          >
            Update
          </Button>
        )}
      </FormWrapper>
    </Modal>
  );
}
