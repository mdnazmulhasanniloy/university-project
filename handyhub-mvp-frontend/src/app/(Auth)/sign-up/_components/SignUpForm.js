"use client";

import { GoogleIcon } from "@/utils/svgLibrary";
import FormWrapper from "@/components/form-components/FormWrapper";
import UCheckbox from "@/components/form-components/UCheckbox";
import UInput from "@/components/form-components/UInput";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useSignUpMutation } from "@/redux/api/authApi";
import { authValidationSchema } from "@/schema/authSchema";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { setToSessionStorage } from "@/utils/sessionStorage";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSetGeoLocation } from "@/hooks/useSetGeoLocation";
import useGetAddressFromCoord from "@/hooks/useGetAddressFromCoord";

export default function SignUpForm() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Customer");
  const router = useRouter();
  const setGeoLocationToStore = useSetGeoLocation();
  const { getAddress } = useGetAddressFromCoord();

  // Sign Up Handler
  const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();

  const onSubmit = async (data) => {
    // Ask for user's geo-location
    // If permitted then use, else set this dummy location as default: "latitude": 0,
    // customer location is gotten here, seller location will be gotten from seller-details-form

    let location = {
      type: "Point",
      coordinates: [0, 0],
    };
    let address = "";

    if (selectedRole === "Customer") {
      location = await setGeoLocationToStore();
    }

    if (
      location?.coordinates?.length > 0 &&
      location.coordinates[0] !== 0 &&
      location.coordinates[1] !== 0
    ) {
      address = await getAddress(
        location.coordinates[1],
        location.coordinates[0],
      );
    }

    try {
      const res = await signUp({
        location,
        address,
        role: selectedRole === "Customer" ? "customer" : "seller",
        ...data,
      }).unwrap();

      SuccessModal("Sign up successful", "Please verify your email.");

      // Store user role in session storage for after otp verification navigation
      setToSessionStorage(
        "handyhub-sign-up-role",
        selectedRole === "Customer" ? "customer" : "seller",
      );

      // Store temp signUpToken for otp verification
      setToSessionStorage("handyhub-signUp-token", res?.data?.otpToken?.token);

      router.push("/otp-verification");
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };

  return (
    <div>
      <section className="space-y-2">
        <h4 className="text-3xl font-semibold">Create Account</h4>
        <p className="text-dark-gray">
          Enter your necessary info to create your account
        </p>
      </section>

      {/* Role Selector */}
      <div className="mb-3 mt-6 space-x-2">
        {["Customer", "Service Provider"].map((role) => (
          <button
            key={role}
            className={cn(
              "h-9 w-32 rounded-2xl text-sm font-medium transition-all duration-300 ease-in-out",
              role === selectedRole
                ? "border border-transparent bg-primary-blue text-white"
                : "border border-black/50 bg-transparent text-black",
            )}
            onClick={() => setSelectedRole(role)}
          >
            {role}
          </button>
        ))}
      </div>

      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(authValidationSchema.signUpSchema)}
      >
        {/* Input Fields */}
        <div className="space-y-3">
          <UInput name="name" type="text" placeholder="Full name" />

          <UInput name="email" type="email" placeholder="Email" />

          <UInput
            name="password"
            type="password"
            placeholder="Password"
            showPassword={showNewPassword}
            setShowPassword={setShowNewPassword}
          />

          <UInput
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
          />
        </div>

        <div className="mb-8 mt-5">
          <UCheckbox
            name={"termsCheckbox"}
            label={
              <p className="text-gray-700">
                I agree with the{" "}
                <Link href="/terms-conditions" className="underline">
                  terms and conditions
                </Link>{" "}
                of <span>HandyHub</span>
              </p>
            }
          />
        </div>

        <Button
          type="submit"
          variant="orange"
          size="auth"
          loading={isSigningUp}
          loadingText="Signing up..."
        >
          Sign Up
        </Button>

        <p className="mt-4 text-center text-sm text-[#666]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#1A1A1A] underline">
            Login
          </Link>
        </p>
      </FormWrapper>
    </div>
  );
}
