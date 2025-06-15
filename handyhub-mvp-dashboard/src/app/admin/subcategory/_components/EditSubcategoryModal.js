import React from "react";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { Button, Modal } from "antd";
import { Loader, Plus } from "lucide-react";
import UUpload from "@/components/Form/UUpload";
import UseImageUpload from "@/lib/useImageUpload";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import toast from "react-hot-toast";
import { useUpdateSubcategoryMutation } from "@/redux/api/subcategoryApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import USelect from "@/components/Form/USelect";

export default function EditSubcategoryModal({
  open,
  setOpen,
  modalData,
  setModalData,
}) {
  const { setFile, imageFile, imageUrl } = UseImageUpload();
  const [updateFn, { isLoading }] = useUpdateSubcategoryMutation();
  const { data: categoryRes } = useGetCategoriesQuery({ limit: 99999 });
  const categories = categoryRes?.data?.data || [];

  const handelSubmit = async (data) => {
    const { image, ...payload } = data;
    const formData = new FormData();

    if (image?.fileList[0]?.originFileObj)
      formData.append("banner", image?.fileList[0]?.originFileObj);
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
      }
    } catch (error) {
      ErrorModal(error?.message || error?.data?.message);
    } finally {
      toast.dismiss("category");
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
        setModalData(null);
      }}
      title="Edit Category"
    >
      <FormWrapper
        onSubmit={handelSubmit}
        defaultValues={{ name: modalData?.name }}
      >
        <UUpload
          uploadTitle={"Upload subcategory image"}
          listType={"picture"}
          name={"image"}
          required={false}
          max={1}
        />
        <UInput
          type="text"
          name="name"
          label="Category Name"
          placeholder={"Enter category name"}
        />
        <USelect
          name="category"
          options={categories.map((category) => ({
            value: category._id,
            label: category?.name,
          }))}
          defaultValue={modalData?.category?._id}
          label={"Select Category"}
          placeholder={"Select Category"}
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
