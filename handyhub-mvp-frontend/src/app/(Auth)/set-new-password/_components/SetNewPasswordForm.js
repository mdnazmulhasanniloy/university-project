"use client";

import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import { Button } from "@/components/ui/button";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { logout } from "@/redux/features/authSlice";
import { authValidationSchema } from "@/schema/authSchema";
import { ConfirmModal, SuccessModal } from "@/utils/customModal";
import { errorToast } from "@/utils/customToast";
import { removeFromSessionStorage } from "@/utils/sessionStorage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function SetNewPasswordForm() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Change password api handler
  const [changePassword, { isLoading }] = useResetPasswordMutation();

  const onSubmit = async (data) => {
    try {
      await changePassword(data).unwrap();

      removeFromSessionStorage("changePasswordToken");

      SuccessModal(
        "Password changed successfully!!",
        "Try logging in with the new password",
      );
      router.push("/login");
    } catch (error) {
      errorToast(error?.message || error?.data?.message || error?.error);
    }
  };
  return (
    <div>
      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold">Set New Password</h4>
        <p className="text-dark-gray">Type in your new password</p>
      </section>

      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(authValidationSchema.setNewPasswordSchema)}
        className="space-y-3"
      >
        <UInput
          name="newPassword"
          type="password"
          placeholder="New password"
          showPassword={showNewPassword}
          setShowPassword={setShowNewPassword}
        />

        <UInput
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
          loading={isLoading}
        />

        <Button type="submit" variant="orange" size="auth">
          Update Password
        </Button>
      </FormWrapper>
    </div>
  );
}
