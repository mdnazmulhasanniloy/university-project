"use client";

import { LogoSvg } from "@/assets/logos/LogoSvg";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { resetPassSchema } from "@/schema/authSchema";
import { SuccessModal } from "@/utils/modalHook";
import { removeFromSessionStorage } from "@/utils/sessionStorage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function SetPasswordForm() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const router = useRouter();
  const onSubmit = async (data) => {
    try {
      const res = await resetPassword(data).unwrap();

      if (res?.success) {
        SuccessModal(
          "Password updated successfully",
          "Please login with the new password"
        );

        router.push("/login");

        // remove the forget pass token
        removeFromSessionStorage("forgotPassToken");
      }
    } catch (error) {
      console.log(error);
      ErrorModal(error?.data?.message);
    }
  };

  return (
    <div className="px-6 py-8">
      <Link
        href="/login"
        className="text-primary-blue flex-center-start gap-x-2 font-medium hover:text-primary-blue/85 mb-4"
      >
        <ArrowLeft size={18} /> Back to login
      </Link>

      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold">Set New Password</h4>
        <p className="text-dark-gray">Enter your new password login</p>
      </section>

      <FormWrapper onSubmit={onSubmit} resolver={zodResolver(resetPassSchema)}>
        <UInput
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!h-10 !mb-0"
        />

        <UInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!h-10 !mb-0"
        />
        {isLoading ? (
          <Button disabled className="w-full !font-semibold !h-10">
            <Loader className="mr-2 h-5 w-5 animate-spin" />
            Updating...
          </Button>
        ) : (
          <Button
            loading={isLoading}
            disabled={isLoading}
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full !font-semibold !h-10"
          >
            Submit
          </Button>
        )}
      </FormWrapper>
    </div>
  );
}
