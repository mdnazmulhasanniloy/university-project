"use client";

import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import { Button } from "@/components/ui/button";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { logout } from "@/redux/features/authSlice";
import { ConfirmModal, SuccessModal } from "@/utils/customModal";
import { errorToast } from "@/utils/customToast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function SellerSettingsContainer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Change password handler
  const [changePassword, { isLoading: isPasswordChanging }] =
    useChangePasswordMutation();

  const onChangePassword = async (data) => {
    try {
      await changePassword(data).unwrap();

      // Prompt user to logout
      ConfirmModal(
        "Password changed successfully",
        "Do you want to logout and login with new password?",
        "Logout",
        "Not right now",
      ).then((res) => {
        if (res?.isConfirmed) {
          dispatch(logout());

          SuccessModal("Logout Successful!");
          router.refresh();
          router.push("/login");
        }
      });
    } catch (error) {
      errorToast(error?.data?.message || error?.error);
    }
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Change Password */}
      <section className="rounded-lg border bg-white text-black shadow">
        <h4 className="border-b border-b-gray-300 p-4 text-2xl font-semibold">
          Change Password
        </h4>

        <FormWrapper
          onSubmit={onChangePassword}
          className={"space-y-5 px-8 py-6"}
        >
          <UInput
            type="password"
            name="oldPassword"
            label="Old Password"
            placeholder="***********"
            showPassword={showOldPass}
            setShowPassword={setShowOldPass}
          />
          <UInput
            type="password"
            name="newPassword"
            label="New Password"
            placeholder="***********"
            showPassword={showNewPass}
            setShowPassword={setShowNewPass}
          />
          <UInput
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="***********"
            showPassword={showConfirmPass}
            setShowPassword={setShowConfirmPass}
          />

          <Button
            type="submit"
            variant="blue"
            size="lg"
            className="rounded-full"
            loading={isPasswordChanging}
          >
            Change Password
          </Button>
        </FormWrapper>
      </section>
    </div>
  );
}
