"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import UTextArea from "@/components/Form/UTextArea";
import { Button, Modal } from "antd";
import { useCreatePackagerMutation } from "@/redux/api/packageApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubscriptionSchema } from "@/schema/subscriptionSchema";

export default function CreateSubscriptionPlanModal({ open, setOpen }) {
  const [createFn, { isLoading }] = useCreatePackagerMutation();
  const onSubmit = async (data) => {
    data = {
      ...data,
      price: Number(data.price),
      durationDay: Number(data.durationDay),
    };
    try {
      const res = await createFn(data).unwrap();
      SuccessModal(res.message);
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
      title="Create Subscription Plan"
      onCancel={() => {
        setOpen(false);
      }}
    >
      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(createSubscriptionSchema)}
      >
        <UInput
          name="title"
          label="Title"
          placeholder="Enter subscription plan title"
        />
        <UInput
          name="shortTitle"
          label="Short Title"
          placeholder="Enter subscription plan short title"
        />
        <UInput
          name="durationDay"
          label="Duration"
          placeholder="Enter Duration Day"
        />
        <UInput
          type="number"
          name="price"
          label="Price"
          placeholder="Enter price"
        />
        <UTextArea
          minRows={5}
          name="shortDescription"
          label="Description"
          placeholder="Enter description"
        />
        {isLoading ? (
          <Button disabled className="w-full !font-semibold !h-10">
            <Loader className="mr-2 h-5 w-5 animate-spin" />
            Loading...
          </Button>
        ) : (
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="w-full"
          >
            Save
          </Button>
        )}
      </FormWrapper>
    </Modal>
  );
}
