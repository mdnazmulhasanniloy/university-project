"use client";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/api/authApi";
import { setUser } from "@/redux/features/authSlice";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { errorToast, successToast } from "@/utils/customToast";
import {
  getFromSessionStorage,
  removeFromSessionStorage,
  setToSessionStorage,
} from "@/utils/sessionStorage";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function OtpVerificationForm() {
  const [value, setValue] = useState("");
  const [showRequired, setShowRequired] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(180); // Timer in seconds
  const router = useRouter();
  const dispatch = useDispatch();
  const fromHref = useSearchParams().get("from-href");

  const [verifyOtp, { isLoading: isVerifyOtpLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResendOtpLoading }] = useResendOtpMutation();

  useEffect(() => {
    if (timer > 0) {
      const countdownInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            setIsResendDisabled(false);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [timer]);

  // Handle Resend OTP functionality
  const handleResendOtp = async () => {
    /**
     * Since, otp verification can be done for both sign-up and forget-password,
     * we are using tokenName and token to preserve the needed information
     */
    let tokenName = getFromSessionStorage("handyhub-signUp-token")
      ? "handyhub-signUp-token"
      : getFromSessionStorage("forgotPassToken")
        ? "forgotPassToken"
        : null;
    let token = getFromSessionStorage(tokenName);

    if (!tokenName) {
      return errorToast("Error: Invalid token");
    }

    try {
      const res = await resendOtp({
        email: jwtDecode(token)?.email,
      }).unwrap();
      if (res?.success) {
        successToast("OTP re-send successful");
        setToSessionStorage(tokenName, res?.data?.token);

        // Disable resend button and start the timer
        setIsResendDisabled(true);

        // Set the timer for 3 minutes (180 seconds)
        setTimer(180);

        // Countdown every second
        const countdownInterval = setInterval(() => {
          setTimer((prev) => {
            if (prev === 1) {
              clearInterval(countdownInterval);
              setIsResendDisabled(false); // Re-enable the button after the timer ends
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      errorToast(error?.data?.message || error?.message);
    }
  };

  // Format the timer to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleVerifyOtp = async () => {
    if (value.length < 6) {
      setShowRequired(true);
      return;
    }

    if (getFromSessionStorage("handyhub-signUp-token")) {
      try {
        const res = await verifyOtp({ otp: value }).unwrap();
        if (res?.success) {
          SuccessModal(
            "OTP Verification Successful",
            "Thanks for becoming a valuable member of Handyhub!",
          );

          // login user
          handleLoginUser(res?.data?.token);

          if (getFromSessionStorage("handyhub-sign-up-role") === "seller") {
            router.push("/seller/dashboard");
          } else {
            router.push(fromHref || "/customer/dashboard");
          }

          // remove temp sign up role & token
          removeFromSessionStorage("handyhub-sign-up-role");
          removeFromSessionStorage("handyhub-signUp-token");
        }
      } catch (error) {
        ErrorModal(error?.data?.message || error?.message);
      }
    } else if (getFromSessionStorage("forgotPassToken")) {
      try {
        const res = await verifyOtp({ otp: value }).unwrap();

        if (res?.success) {
          successToast("OTP verification successful");

          // set changePassword token to session storage
          setToSessionStorage("changePasswordToken", res?.data?.token);

          // remove the forgetPassToken
          removeFromSessionStorage("forgotPassToken");

          router.push("/set-new-password");
        }
      } catch (error) {
        ErrorModal(error?.data?.message || error?.message);
      }
    }
  };

  // Login user
  const handleLoginUser = (token) => {
    dispatch(
      setUser({
        user: jwtDecode(token),
        token: token,
      }),
    );

    router.refresh();
  };

  return (
    <div>
      <section className="mb-8 space-y-2">
        <h4 className="text-3xl font-semibold">OTP Verification</h4>
        <p className="text-dark-gray">
          We&apos;ve send a verification code to your email. Check your inbox
          and enter the code here:
        </p>
      </section>

      <section className="mx-auto mb-5 w-max">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup className="flex items-center gap-x-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <InputOTPSlot
                key={idx}
                index={idx}
                className="h-[70px] w-[60px] !rounded-lg bg-[#dfdfdf] text-4xl font-extrabold"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {showRequired && (
          <p className="mt-3 text-center text-sm font-medium text-danger">
            Please enter your one-time password correctly
          </p>
        )}
      </section>

      <Button
        variant="orange"
        size="auth"
        className="w-full"
        onClick={handleVerifyOtp}
        loading={isVerifyOtpLoading}
        loadingText="Verifying..."
      >
        Verify
      </Button>

      <p className="mx-auto mt-1 w-max font-medium text-[#999]">
        Didn&apos;t get the code?{" "}
        <Button
          variant="link"
          className="px-0 text-primary-blue"
          onClick={handleResendOtp}
          disabled={isResendDisabled || isResendOtpLoading}
        >
          {isResendDisabled ? `Resend in ${formatTime(timer)}` : "Resend"}
        </Button>
      </p>
    </div>
  );
}
