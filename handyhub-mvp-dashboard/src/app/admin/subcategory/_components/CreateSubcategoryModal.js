"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import USelect from "@/components/Form/USelect";
import UUpload from "@/components/Form/UUpload";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useCreateSubcategoryMutation } from "@/redux/api/subcategoryApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import { Button, Modal } from "antd";
import { Loader } from "lucide-react";

export default function CreateSubcategoryModal({ open, setOpen }) {
  const [createFn, { isLoading }] = useCreateSubcategoryMutation();
  const { data: categoryRes } = useGetCategoriesQuery({ limit: 99999 });
  const categories = categoryRes?.data?.data || [];

  const handelSubmit = async (data) => {
    const { image, ...payload } = data;
    const formData = new FormData();

    if (!image?.fileList[0]?.originFileObj) {
      ErrorModal("Please Select a subcategory image");
      return;
    }

    formData.append("banner", image?.fileList[0]?.originFileObj);
    formData.append("data", JSON.stringify(payload));
    try {
      const res = await createFn(formData).unwrap();

      SuccessModal(res?.message);
      if (res?.success) {
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
      title="Create Subcategory"
    >
      <FormWrapper onSubmit={handelSubmit}>
        <UUpload
          uploadTitle={"Upload subcategory image"}
          listType={"picture"}
          name={"image"}
          max={1}
        />

        <UInput
          type="text"
          name="name"
          label="Subcategory Name"
          required={true}
          placeholder="Enter subcategory name"
        />
        <USelect
          name="category"
          options={categories.map((category) => ({
            value: category._id,
            label: category?.name,
          }))}
          label={"Select Category"}
          placeholder={"Select Category"}
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
