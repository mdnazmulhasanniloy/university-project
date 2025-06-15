"use client";

import FormWrapper from "@/components/Form/FormWrapper";
import UInput from "@/components/Form/UInput";
import { editProfileSchema } from "@/schema/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { Loader } from "lucide-react";

export default function EditProfileForm({
  profileData,
  handelToUpdateProfile,
  isLoading,
}) {
  return (
    <section className="px-10 mt-5">
      {/* <h4></h4> */}
      <FormWrapper
        onSubmit={handelToUpdateProfile}
        resolver={zodResolver(editProfileSchema)}
        defaultValues={{
          name: profileData?.name,
          email: profileData?.email,
          phoneNumber: profileData?.phoneNumber,
        }}
      >
        <UInput name="name" label="Name" type="text" />
        <UInput name="email" label="Email" type="email" disabled />
        <UInput name="phoneNumber" label="Contact" type="contact" />

        {isLoading ? (
          <Button disabled className="!h-10 w-full !font-semibold">
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            saving...
          </Button>
        ) : (
          <Button
            htmlType="submit"
            className="w-full"
            size="large"
            type="primary"
          >
            Save
          </Button>
        )}
      </FormWrapper>
    </section>
  );
}
