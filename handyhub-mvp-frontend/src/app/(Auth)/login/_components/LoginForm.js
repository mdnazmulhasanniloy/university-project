"use client";

import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authValidationSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useGoogleLoginMutation, useSignInMutation } from "@/redux/api/authApi";
import { SuccessModal } from "@/utils/customModal";
import { selectUser, setUser } from "@/redux/features/authSlice";
import { jwtDecode } from "jwt-decode";
import CustomFormError from "@/components/CustomFormError/CustomFormError";
import { GoogleIcon } from "@/utils/svgLibrary";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn as signInWithGoogle } from "next-auth/react";
import { useSelector } from "react-redux";

export default function LoginForm({ nextAuthUserData }) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [formError, setFormError] = useState(null);
  const dispatch = useDispatch();
  const userId = useSelector(selectUser)?.userId;

  /**
   * Check if from-href exist
   * [from-href]: Indicates previous page before login and
   *              it is used to redirect user to specific page after login
   */
  const fromHref = useSearchParams().get("from-href");

  // Login api handler
  const [signIn, { isLoading }] = useSignInMutation();

  const onLoginSubmit = async (data) => {
    try {
      const res = await signIn(data).unwrap();

      if (res?.success) {
        SuccessModal("Login Successful!");

        // Set user info into store
        dispatch(
          setUser({
            user: jwtDecode(res?.data?.accessToken),

            token: res?.data?.accessToken,
          }),
        );

        // Redirect based on user role
        const userRole = jwtDecode(res?.data?.accessToken)?.role;

        router.push(fromHref || (userRole ? `/${userRole}/dashboard` : "/"));
        router.refresh();
        setFormError(null);
      }
    } catch (error) {
      setFormError(error?.message || error?.data?.message || error?.error);
    }
  };

  // Login user using google provider data if
  // nextAuthUserData is available
  const [googleLogin, { isLoading: isGoogleLoginLoading }] =
    useGoogleLoginMutation();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        const res = await googleLogin({
          email: nextAuthUserData?.email,
          name: nextAuthUserData?.name,
          profile: nextAuthUserData?.image || "",
        }).unwrap();

        if (res?.data?.accessToken) {
          SuccessModal("Login Successful");

          dispatch(
            setUser({
              user: jwtDecode(res?.data?.accessToken),
              token: res?.data?.accessToken,
            }),
          );

          router.push("/");
          router.refresh();
        }
      } catch (error) {
        setFormError(error?.status);
      }
    };

    if (nextAuthUserData?.email && !userId) {
      handleGoogleLogin();
    }
  }, [nextAuthUserData?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold">Login</h4>
        <p className="text-dark-gray">Enter your email and password to login</p>
      </section>

      <FormWrapper
        onSubmit={onLoginSubmit}
        resolver={zodResolver(authValidationSchema.loginSchema)}
      >
        {/* Input Fields */}
        <div className="space-y-3">
          <UInput
            name="email"
            type="email"
            placeholder="Email"
            className="px-3 py-5"
          />

          <UInput
            name="password"
            type="password"
            placeholder="Password"
            className="px-3 py-5"
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </div>

        <Link
          href="/forgot-password"
          className="mb-5 ml-auto mt-2 block w-max text-sm text-gray-500 hover:text-black"
        >
          Forgot Password?
        </Link>

        <Button
          type="submit"
          variant="orange"
          size="auth"
          loading={isLoading}
          loadingText="Logging In..."
        >
          Log In
        </Button>

        <p className="mt-3 text-center text-sm text-[#666]">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="ml-1 text-[#1A1A1A] underline">
            Create One
          </Link>
        </p>

        {/* Show form error message */}
        {formError && (
          <CustomFormError formError={formError} extraClass="mt-4" />
        )}
      </FormWrapper>

      {/* Other Login Options Divider */}
      <div className="flex-center mb-4 mt-7 w-full gap-x-3">
        <Separator className="w-1/3 bg-dark-gray" />
        <p className="w-max whitespace-nowrap text-center text-sm text-dark-gray">
          Or, continue with
        </p>
        <Separator className="w-1/3 bg-dark-gray" />
      </div>

      <button
        className="flex-center-between w-full rounded-lg border px-3 py-2 hover:bg-gray-100"
        onClick={() => signInWithGoogle("google")}
        disabled={isGoogleLoginLoading}
      >
        <div className="w-1/3">
          <GoogleIcon />
        </div>

        <p className="flex-grow whitespace-nowrap text-center font-medium">
          Continue with Google
        </p>

        <div className="w-1/3" />
      </button>
    </div>
  );
}
