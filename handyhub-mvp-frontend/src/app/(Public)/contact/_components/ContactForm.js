"use client";

import AnimatedArrow from "@/components/AnimatedArrow/AnimatedArrow";
import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import UTextarea from "@/components/form-components/UTextarea";
import { Button } from "@/components/ui/button";
import { useContactSupportMutation } from "@/redux/api/supportApi";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

const contactValidationSchema = z.object({
  name: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export default function ContactForm() {
  const [contact, { isLoading }] = useContactSupportMutation();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await contact(data).unwrap();

      SuccessModal(
        "Message sent successfully!",
        "We'll get back to you through email. Stay tuned!",
      );

      router.push("/");
    } catch (error) {
      ErrorModal(error?.data?.message || error?.message);
    }
  };
  return (
    <FormWrapper
      onSubmit={onSubmit}
      resolver={zodResolver(contactValidationSchema)}
    >
      <div className="space-y-8">
        <UInput name="name" label="Full Name" placeholder="Enter your name" />

        <UInput
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email address"
        />

        <UTextarea
          name="description"
          label="Description"
          placeholder="Tell us in detail of the issues you're facing..."
        />
      </div>

      <Button
        variant="blue"
        className="group mt-10 h-[2.7rem] w-full"
        loading={isLoading}
        loadingText="Submitting..."
      >
        Submit
        <AnimatedArrow />
      </Button>
    </FormWrapper>
  );
}
