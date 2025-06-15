"use client";

import CustomLoader from "@/components/CustomLoader/CustomLoader";
import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import UMultiSelect from "@/components/form-components/UMultiSelect";
import UTagsInput from "@/components/form-components/UTagsInput";
import UTextEditor from "@/components/form-components/UTextEditor";
import UUpload from "@/components/form-components/UUpload";
import GoogleMapContainer from "@/components/GoogleMapContainer/GoogleMapContainer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useEditServicePostMutation,
  useGetSingleServicePostQuery,
} from "@/redux/api/servicePostApi";
import { useGetAllServicesQuery } from "@/redux/api/servicesApi";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { selectUser } from "@/redux/features/authSlice";
import { servicePostValidations } from "@/schema/servicePostSchema";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function EditServicePost({ id }) {
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const userId = useSelector(selectUser)?.userId;
  const router = useRouter();

  // Get profile
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery(
    {},
    { skip: !userId },
  );

  // Get services of the category
  const { data: servicesRes, isLoading: isServicesLoading } =
    useGetAllServicesQuery(
      { category: profile?.category?._id },
      { skip: !profile?.category?._id },
    );
  const services = servicesRes?.data?.data || [];

  // Get service post
  const { data: servicePost, isLoading: isFetchingServicePost } =
    useGetSingleServicePostQuery(id, { skip: !id });

  // edit post api handler
  const [editPost, { isLoading: isEditingPost }] = useEditServicePostMutation();

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (data.banner[0] instanceof File) {
      formData.append("banner", data.banner[0]);
    }

    // Format input payload
    const services = data.services.map((service) => service.value);
    const location = {
      coordinates: [longitude, latitude],
    };

    delete data["banner"];
    delete data["services"];
    delete data["comment"];

    formData.append(
      "data",
      JSON.stringify({
        services,
        location,
        ...data,
      }),
    );

    try {
      await editPost({ id: id, data: formData }).unwrap();
      SuccessModal("Service post updated successfully!");
      router.push("/seller/dashboard?activeTab=servicePosts");
    } catch (error) {
      ErrorModal(error?.message || error?.data?.message || error?.error);
    }
  };

  // Set default location value from profile
  useEffect(() => {
    if (profile?.location) {
      setAddress(servicePost?.address || profile?.address);
      setLongitude(
        servicePost?.location?.coordinates[0] ||
          profile?.location?.coordinates[0],
      );
      setLatitude(
        servicePost?.location?.coordinates[1] ||
          profile?.location?.coordinates[1],
      );
    }
  }, [profile]);

  if (isProfileLoading || isFetchingServicePost || isServicesLoading) {
    return (
      <div className="flex-center min-h-[50vh]">
        <CustomLoader type="colorful" variant="lg" />
      </div>
    );
  }

  // Set remaining default values
  const defaultValues = {
    title: servicePost?.title,
    description: servicePost?.description,
    services: servicePost?.services?.map((service) => ({
      label: service.name,
      value: service._id,
    })),
    tags: servicePost?.tags,
    banner: [{ url: servicePost?.banner }],
    address: servicePost?.address || profile?.address,
  };

  return (
    <section className="rounded-lg border bg-white p-5 shadow-md">
      <Link
        href={"/seller/dashboard?activeTab=servicePosts"}
        className="flex-center-start gap-x-2 text-primary-blue/90"
      >
        <ArrowLeft size={18} /> back to all posts
      </Link>

      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(servicePostValidations.editServicePostSchema)}
        defaultValues={defaultValues}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        className="mt-5 space-y-8"
      >
        <UUpload
          name="banner"
          maxSize={10}
          maxFileCount={1}
          label="Cover Photo"
        />

        <UInput
          name="title"
          label="Service Title"
          placeholder="Enter service title"
        />

        <div className="flex flex-col gap-y-3">
          <Label htmlFor="address">
            Where is the service primary available?
            <p className="text-muted">
              (Note: Don&apos;t worry the service will be available to all. This
              is just to make it easier for users to find the service in nearby
              areas)
            </p>
          </Label>

          <GoogleMapContainer
            address={address}
            setAddress={setAddress}
            latitude={latitude}
            setLatitude={setLatitude}
            longitude={longitude}
            setLongitude={setLongitude}
          />

          {/* Address Input box */}
          <UInput name="address" disabled={true} value={address} />
        </div>

        <UTextEditor
          name="description"
          label="Description"
          placeholder="Enter detailed description of you service post"
        />

        <UMultiSelect
          name="services"
          label="Services"
          placeholder="Select the services that you include in this post"
          data={services?.map((service) => ({
            label: service?.name,
            value: service?._id,
          }))}
        />

        <UTagsInput
          name="tags"
          tagsProp={servicePost?.tags}
          label={
            <div>
              <span>Tags</span>
              <p className="text-sm text-muted">
                (Note: It helps users to find the service easily by searching)
              </p>
            </div>
          }
          placeholder="Enter tags"
        />

        <Button
          variant="blue"
          size="lg"
          className="w-full rounded-full"
          loading={isEditingPost}
          loadingText="Creating post..."
        >
          Submit
        </Button>
      </FormWrapper>
    </section>
  );
}
