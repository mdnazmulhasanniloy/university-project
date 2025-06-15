import { Button } from "@/components/ui/button";
import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import UPhoneInput from "@/components/form-components/UPhoneInput";
import UTextarea from "@/components/form-components/UTextarea";
import UMultiSelect from "@/components/form-components/UMultiSelect";
import { PlusCircle } from "lucide-react";
import { selectUser } from "@/redux/features/authSlice";
import { useSelector } from "react-redux";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/api/userApi";
import placeholderBannerBg from "/public/images/placeholder-bg.svg";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import { useEffect, useState } from "react";
import USelect from "@/components/form-components/USelect";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import { SelectItem } from "@/components/ui/select";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import ModalWrapper from "@/components/ModalWrapper.js/ModalWrapper";
import {
  useAddNewServiceMutation,
  useGetAllServicesQuery,
} from "@/redux/api/servicesApi";
import { errorToast, successToast } from "@/utils/customToast";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import { Camera } from "lucide-react";
import { z } from "zod";
import UUpload from "@/components/form-components/UUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleMapContainer from "@/components/GoogleMapContainer/GoogleMapContainer";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import Link from "next/link";

// Validation schemas
const addServiceSchema = z.object({
  name: z
    .string({ required_error: "Service name is required" })
    .min(1, "Service name is required"),
});

const changePictureSchema = z.object({
  image: z.union([
    z.array(z.instanceof(File)),
    z.array(
      z.object({
        url: z.string().url("Invalid URL format"),
      }),
    ),
  ]),
  banner: z.union([
    z.array(z.instanceof(File)),
    z.array(
      z.object({
        url: z.string().url("Invalid URL format"),
      }),
    ),
  ]),
});

export default function SellerProfile() {
  const { userId, role } = useSelector(selectUser) ?? {};
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showChangePictureModal, setShowChangePictureModal] = useState(false);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  // Get seller profile
  const { data: profile, isLoading } = useGetProfileQuery(
    {},
    { skip: !userId || role !== "seller" },
  );

  // Set default coordinates values
  useEffect(() => {
    if (profile?.location) {
      setAddress(profile?.address);
      setLongitude(profile?.location?.coordinates[0]);
      setLatitude(profile?.location?.coordinates[1]);
    }
  }, [profile]);

  // Get all categories
  const { data: categoriesRes, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery({}, { limit: 99999999 });
  const categories = categoriesRes?.data || [];

  // Get all services based on category
  const { data: servicesRes, isLoading: isServicesLoading } =
    useGetAllServicesQuery(
      { category: profile?.category?._id || selectedCategory },
      { limit: 99999999 },
    );
  const services = servicesRes?.data?.data || [];

  // Update seller profile
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const onUpdateProfile = async (data) => {
    const formData = new FormData();

    const services = data.services.map((service) => service.value);
    delete data["services"];

    formData.append(
      "data",
      JSON.stringify({
        ...data,
        services,
        location: { coordinates: [longitude, latitude] },
      }),
    );

    try {
      await updateProfile(formData).unwrap();
      SuccessModal("Profile updated successfully!");
    } catch (error) {
      ErrorModal(error?.message || error?.data?.message || error?.error);
    }
  };

  if (isLoading || isCategoriesLoading || isServicesLoading) {
    return (
      <div className="flex-center h-[50vh]">
        <CustomLoader type="colorful" variant="lg" />;
      </div>
    );
  }

  // Set default values for the form
  const defaultValues = {
    name: profile?.name,
    designation: profile?.designation,
    category: profile?.category?._id || "",
    email: profile?.email,
    phoneNumber: profile?.phoneNumber,
    address: profile?.address,
    aboutMe: profile?.aboutMe || "",
    services: profile?.services?.map((service) => ({
      value: service._id,
      label: service.name,
    })),
  };

  return (
    <div className="mt-4 rounded-lg border bg-white p-8 shadow-md">
      {/* Banner + Profile pic */}
      <section
        style={{
          backgroundImage: `url(${profile?.banner || placeholderBannerBg?.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="relative max-h-96 min-h-56 rounded-lg"
      >
        <div className="absolute -bottom-16 lg:left-10">
          <CustomAvatar
            img={profile?.profile}
            name={profile?.name}
            className="aspect-square size-[120px] rounded-full text-2xl font-semibold ring-2 ring-white ring-offset-2 ring-offset-white lg:h-[150px] lg:w-[150px]"
          />
        </div>
      </section>

      {/* Placeholder div */}
      <div className="flex h-24 w-full flex-col items-end justify-start py-1 lg:flex-row lg:items-start lg:justify-end">
        <CustomTooltip title="Change profile picture and banner">
          <Button
            variant="ghostBlue"
            className="text-primary-blue"
            onClick={() => setShowChangePictureModal(true)}
          >
            <Camera size={20} /> Change Pictures
          </Button>
        </CustomTooltip>

        <CustomTooltip title="See how your profile looks to customers">
          <Button variant="ghostBlue" className="text-primary-blue" asChild>
            <Link href={`/seller/${profile?._id}`}>
              <Eye size={20} /> View Profile
            </Link>
          </Button>
        </CustomTooltip>
      </div>

      <FormWrapper
        onSubmit={onUpdateProfile}
        defaultValues={defaultValues}
        className="space-y-6"
      >
        <UInput name="name" label="Full Name" placeholder="Enter your name" />
        <UInput
          name="designation"
          label="Designation"
          placeholder="e.g Plumber, Electrician...."
        />

        <UPhoneInput
          name="phoneNumber"
          label="Phone Number"
          placeholder="Enter your phone number"
        />

        <div className="flex flex-col gap-y-3">
          <Label htmlFor="address">Where are you located? *</Label>
          <GoogleMapContainer
            address={address}
            setAddress={setAddress}
            latitude={latitude}
            setLatitude={setLatitude}
            longitude={longitude}
            setLongitude={setLongitude}
          />

          {/* Address Input box */}
          <UInput
            name="address"
            disabled={true}
            value={address}
            placeholder="Enter your address"
          />
        </div>

        <UTextarea
          name="aboutMe"
          label="About Me"
          placeholder="Tell customers about yourself"
        />

        <USelect
          name="category"
          label="Select Category"
          selectTrigger="Select which category your services are related to"
          selectItems={categories?.map((category) => (
            <SelectItem key={category?._id} value={category?._id}>
              {category?.name}
            </SelectItem>
          ))}
          onChange={(selectedValue) => setSelectedCategory(selectedValue)}
        />

        <UMultiSelect
          name="services"
          data={
            services?.length > 0
              ? services.map((service) => ({
                  label: service.name,
                  value: service._id,
                }))
              : []
          }
          emptyText={"No results found!! Click plus on top right to add one."}
          label={
            <div className="flex-center-between">
              <span>Services</span>
              <button
                type="button"
                onClick={() => {
                  if (!selectedCategory && !profile?.category) {
                    return ErrorModal("Please select a category first!!");
                  }

                  setShowAddServiceModal(true);
                }}
              >
                <PlusCircle size={20} />

                <div className="sr-only">Add service</div>
              </button>
            </div>
          }
          placeholder={
            !profile?.category && !selectedCategory
              ? "Select a category first"
              : "Select service or multiple services"
          }
        />

        <Button
          type="submit"
          variant="blue"
          className="w-full rounded-full"
          size="lg"
          loading={isUpdatingProfile}
        >
          Save Changes
        </Button>
      </FormWrapper>

      {/* Add service modal */}
      <AddServiceModal
        open={showAddServiceModal}
        setOpen={setShowAddServiceModal}
        category={selectedCategory || profile?.category?._id}
      />

      {/* Change Picture Modal */}
      <ChangePictureModal
        open={showChangePictureModal}
        setOpen={setShowChangePictureModal}
        isLoading={isLoading}
        profile={profile}
      />
    </div>
  );
}

// Add a new service modal
const AddServiceModal = ({ open, setOpen, category }) => {
  const [addService, { isLoading }] = useAddNewServiceMutation();

  if (!category) return alert("Please select a category first!!");

  // Add new service
  const handleNewService = async (data) => {
    try {
      await addService({ category, ...data }).unwrap();
      successToast("Service added successfully");
      setOpen(false);
    } catch (error) {
      errorToast(error?.data?.message || error?.error);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen} title="Add a new service">
      <FormWrapper
        onSubmit={handleNewService}
        resolver={zodResolver(addServiceSchema)}
        className="space-y-4"
      >
        <UInput
          name="name"
          label="Service Name *"
          placeholder="Enter service name (e.g Pipe Cleaning, Lawn Mowing etc)"
        />

        <Button variant="blue" className="w-full" size="lg" loading={isLoading}>
          Submit
        </Button>
      </FormWrapper>
    </ModalWrapper>
  );
};

// Change picture modal
const ChangePictureModal = ({ open, setOpen, isLoading, profile }) => {
  const [updateProfile, { isLoading: isProfileUpdating }] =
    useUpdateProfileMutation();

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (data.banner?.length > 0) {
      if (!data?.image[0]?.url) {
        formData.append("banner", data.banner[0]);
        delete data["banner"];
      }
    }

    if (data.image?.length > 0) {
      if (!data?.image[0]?.url) {
        formData.append("profile", data.image[0]);
        delete data["image"];
      }
    }

    try {
      await updateProfile(formData).unwrap();
      successToast("Pictures updated successfully!");
      setOpen(false);
    } catch (error) {
      errorToast(error?.data?.message || error?.error);
    }
  };

  if (isLoading) {
    return <CustomLoader type="colorful" variant="lg" />;
  }

  const defaultValues = {
    image: profile?.profile ? [{ url: profile?.profile }] : [{}],
    banner: profile?.banner ? [{ url: profile?.banner }] : [{}],
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(changePictureSchema)}
        defaultValues={defaultValues}
        className="space-y-5"
      >
        <UUpload
          name="banner"
          label="Profile Banner"
          maxSize={5}
          maxFileCount={1}
        />
        <UUpload
          name="image"
          label="Profile Picture"
          maxSize={5}
          maxFileCount={1}
        />
        <Button
          variant="blue"
          className="w-full"
          size="lg"
          loading={isProfileUpdating}
        >
          Submit
        </Button>
      </FormWrapper>
    </ModalWrapper>
  );
};
