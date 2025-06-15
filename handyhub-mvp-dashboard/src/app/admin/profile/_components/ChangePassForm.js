"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import {
  changePasswordSchema,
  editProfileSchema,
} from "@/schema/profileSchema";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { Loader } from "lucide-react";

export default function ChangePassForm() {
  const [changePasswordFn, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (data) => {
    try {
      const res = await changePasswordFn(data).unwrap();
      SuccessModal("Password changed successfully");
    } catch (err) {
      ErrorModal(err?.message || err?.data?.message);
    }
  };

  return (
    <section className="px-10 mt-5">
      {/* <h4></h4> */}
      <FormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(changePasswordSchema)}
      >
        <UInput
          name="oldPassword"
          label="Old Password"
          type="password"
          placeholder="***********"
        />
        <UInput
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="***********"
        />
        <UInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="***********"
        />
        {isLoading ? (
          <Button disabled className="!h-10 w-full !font-semibold">
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            saving...
          </Button>
        ) : (
          <Button
            htmlType="submit"
            className="w-full"
            size="large"
            type="primary"
          >
            Save
          </Button>
        )}
      </FormWrapper>
    </section>
  );
}
