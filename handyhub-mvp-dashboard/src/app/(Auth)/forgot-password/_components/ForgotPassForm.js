"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassSchema, loginSchema } from "@/schema/authSchema";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { Button } from "antd";
import { ArrowLeft, Loader } from "lucide-react";
import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { setToSessionStorage } from "@/utils/sessionStorage";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import { useRouter } from "next/navigation";

export default function ForgotPassForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const res = await forgotPassword(data).unwrap();

      if (res?.success) {
        SuccessModal(res?.message);

        // set token to session storage
        setToSessionStorage("forgotPassToken", res.data?.token);

        // send to otp verify page
        router.push("/otp-verification");
      }
    } catch (error) {
      ErrorModal(error?.data?.message);
    }
  };

  return (
    <div className="px-6 py-8 w-full">
      <Link
        href="/login"
        className="text-primary-blue flex-center-start gap-x-2 font-medium hover:text-primary-blue/85 mb-4"
      >
        <ArrowLeft size={18} /> Back to login
      </Link>

      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold">Forgot Password</h4>
        <p className="text-dark-gray">
          Enter your email and we&apos;ll send you an otp for verification
        </p>
      </section>

      <FormWrapper onSubmit={onSubmit} resolver={zodResolver(forgotPassSchema)}>
        <UInput
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          size="large"
          className="!h-10"
        />

        {isLoading ? (
          <Button disabled className="w-full !font-semibold !h-10">
            <Loader className="mr-2 h-5 w-5 animate-spin" />
            Loading in...
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
