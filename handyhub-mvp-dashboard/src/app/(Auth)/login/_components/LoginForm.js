"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema/authSchema";
import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { Button } from "antd";
import { useSignInMutation } from "@/redux/api/authApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import { Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function LoginForm() {
  const [signIn, { isLoading }] = useSignInMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const onLoginSubmit = async (data) => {
    try {
      const res = await signIn(data).unwrap();
      if (res?.success) {
        SuccessModal("Login Successful");

        // set user
        dispatch(
          setUser({
            user: jwtDecode(res?.data?.accessToken),
            token: res?.data?.accessToken,
          }),
        );

        // send user back or home
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      ErrorModal(error?.message || error?.data?.message);
    }
  };

  return (
    <div className="w-full rounded-none px-6 py-8 shadow-none shadow-primary-blue/10">
      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold">Admin Login</h4>
        <p className="text-dark-gray">
          Enter your email and password to access admin panel
        </p>
      </section>

      <FormWrapper onSubmit={onLoginSubmit} resolver={zodResolver(loginSchema)}>
        <UInput
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          size="large"
          className="!h-10"
        />

        <UInput
          name="password"
          label="Password"
          type="password"
          placeholder="*************"
          size="large"
          className="!mb-0 !h-10"
        />
        {isLoading ? (
          <Button disabled className="!h-10 w-full !font-semibold">
            <Loader className="mr-2 h-5 w-5 animate-spin" />
            Singing in...
          </Button>
        ) : (
          <Button
            loading={isLoading}
            disabled={isLoading}
            htmlType="submit"
            type="primary"
            size="large"
            className="!h-10 w-full !font-semibold"
          >
            SIGN IN
          </Button>
        )}

        <Link
          href="/forgot-password"
          className="mt-2 block text-center font-medium text-primary-blue hover:text-primary-blue/85"
        >
          I forgot my password
        </Link>
      </FormWrapper>
    </div>
  );
}
