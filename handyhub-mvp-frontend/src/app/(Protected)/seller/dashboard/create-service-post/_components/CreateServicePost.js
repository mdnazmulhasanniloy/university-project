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
import { useCreateServicePostMutation } from "@/redux/api/servicePostApi";
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

export default function CreateServicePost() {
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const router = useRouter();

  const userId = useSelector(selectUser)?.userId;

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

  // Create service post handler
  const [createServicePost, { isLoading: isCreatingPost }] =
    useCreateServicePostMutation();

  const onSubmit = async (data) => {
    if (latitude === 0 && longitude === 0) {
      return alert("Please provide an address!!");
    }

    const formData = new FormData();

    if (typeof data.banner !== "string") {
      formData.append("banner", data.banner[0]);
      delete data["banner"];
    }

    // format input data
    // const tags = data.tags?.map((tag) => tag.text);
    const services = data.services.map((service) => service.value);
    const location = {
      coordinates: [longitude, latitude],
    };

    data["category"] = profile?.category?._id;

    // delete data["tags"];
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
      await createServicePost(formData).unwrap();
      SuccessModal("Service post created successfully!");
      router.push("/seller/dashboard?activeTab=servicePosts");
    } catch (error) {
      ErrorModal(error?.message || error?.data?.message || error?.error);
    }
  };

  // Set default location value from profile
  useEffect(() => {
    if (profile?.location) {
      setAddress(profile?.address);
      setLongitude(profile?.location?.coordinates[0]);
      setLatitude(profile?.location?.coordinates[1]);
    }
  }, [profile]);

  if (isProfileLoading || isServicesLoading) {
    return (
      <div className="flex-center min-h-[50vh]">
        <CustomLoader type="colorful" variant="lg" />
      </div>
    );
  }

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
        resolver={zodResolver(servicePostValidations.createServicePostSchema)}
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
          loading={isCreatingPost}
          loadingText="Creating post..."
        >
          Submit
        </Button>
      </FormWrapper>
    </section>
  );
}
