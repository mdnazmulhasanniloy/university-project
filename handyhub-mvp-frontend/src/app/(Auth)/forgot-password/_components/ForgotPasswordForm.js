"use client";

import CustomFormError from "@/components/CustomFormError/CustomFormError";
import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import { Button } from "@/components/ui/button";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { authValidationSchema } from "@/schema/authSchema";
import { SuccessModal } from "@/utils/customModal";
import { setToSessionStorage } from "@/utils/sessionStorage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onSubmit = async (data) => {
    try {
      const res = await forgotPassword(data).unwrap();

      if (res?.success) {
        SuccessModal(
          "OTP sent to email",
          "Please check your email for otp verification",
        );

        // Set forgotPassToken in session-storage
        setToSessionStorage("forgotPassToken", res.data.token);

        // Sent to update password page
        router.push("/otp-verification");
      }
    } catch (error) {
      setFormError(error?.message || error?.data?.message || error?.error);
    }
  };

  return (
    <div>
      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold">Forgot Password</h4>
        <p className="text-dark-gray">
          Enter your email below to request an OTP for account password reset.
        </p>
      </section>

      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(authValidationSchema.forgotPasswordSchema)}
        className="space-y-5"
      >
        <UInput name="email" type="email" placeholder="Email" />

        <Button
          type="submit"
          variant="orange"
          size="auth"
          loading={isLoading}
          loadingText="Submitting..."
        >
          Submit
        </Button>
      </FormWrapper>

      {formError && <CustomFormError formError={formError} />}
    </div>
  );
}
