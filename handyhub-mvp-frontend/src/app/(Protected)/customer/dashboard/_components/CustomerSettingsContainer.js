"use client";

import FormWrapper from "@/components/form-components/FormWrapper";
import UInput from "@/components/form-components/UInput";
import UPhoneInput from "@/components/form-components/UPhoneInput";
import { Button } from "@/components/ui/button";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import { useSelector } from "react-redux";
import { logout, selectUser } from "@/redux/features/authSlice";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/api/userApi";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerProfileUpdateSchema } from "@/schema/customerSchema";
import { ConfirmModal, ErrorModal, SuccessModal } from "@/utils/customModal";
import { X } from "lucide-react";
import { errorToast } from "@/utils/customToast";
import { useEffect, useState } from "react";
import UUpload from "@/components/form-components/UUpload";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { authValidationSchema } from "@/schema/authSchema";
import { Label } from "@/components/ui/label";
import GoogleMapContainer from "@/components/GoogleMapContainer/GoogleMapContainer";

export default function CustomerSettingsContainer() {
  const { userId } = useSelector(selectUser) ?? {};
  const [profilePicInput, setProfilePicInput] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const dispatch = useDispatch();
  const router = useRouter();

  // Get profile
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery(
    {},
    { skip: !userId },
  );

  // Update profile api
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Change and show profile pic locally
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfilePicInput(file);
      setProfilePicUrl(URL.createObjectURL(file));
    }
  };

  // Update profile handler
  const onUpdateProfile = async (data) => {
    const formData = new FormData();
    if (profilePicInput) {
      formData.append("profile", profilePicInput);
    }

    if (data.banner) {
      formData.append("banner", data.banner[0]);
      delete data["banner"];
    }

    delete data["address"];

    formData.append(
      "data",
      JSON.stringify({
        location: {
          type: "Points",
          coordinates: [longitude, latitude],
        },
        address,
        ...data,
      }),
    );

    try {
      await updateProfile(formData).unwrap();
      SuccessModal("Profile updated successfully!");

      setProfilePicUrl(null);
      setProfilePicInput(null);
      document.getElementById("profilePicInput").value = null;
    } catch (error) {
      ErrorModal(error?.message || "Profile update failed");
    }
  };

  // Change password handler
  const [changePassword, { isLoading: isPasswordChanging }] =
    useChangePasswordMutation();

  const onChangePassword = async (data) => {
    try {
      await changePassword(data).unwrap();

      // Prompt user to logout
      ConfirmModal(
        "Password changed successfully",
        "Do you want to logout and login with new password?",
        "Logout",
        "Not right now",
      ).then((res) => {
        if (res?.isConfirmed) {
          dispatch(logout());

          SuccessModal("Logout Successful!");
          router.refresh();
          router.push("/login");
        }
      });
    } catch (error) {
      errorToast(error?.data?.message || error?.error);
    }
  };

  // Set default values
  const defaultValues = !isProfileLoading
    ? {
        name: profile?.name ?? "",
        email: profile?.email,
        phoneNumber: profile?.phoneNumber ?? "",
        address: profile?.address ?? "",
        banner: profile?.banner ? [{ url: profile?.banner }] : [],
      }
    : {};

  // Set default coordinates values
  useEffect(() => {
    if (profile?.location) {
      // setAddress(profile?.address);
      setLongitude(profile?.location?.coordinates[0]);
      setLatitude(profile?.location?.coordinates[1]);
    }
  }, [profile]);

  return (
    <div className="mt-8 space-y-8">
      {/* Update Profile */}
      <section className="rounded-lg border bg-white text-black shadow">
        <h4 className="border-b border-b-gray-300 p-4 text-2xl font-semibold">
          Account Settings
        </h4>

        {isProfileLoading ? (
          <div className="flex-center h-[45vh]">
            <CustomLoader variant="lg" type="colorful" />
          </div>
        ) : (
          <div className="px-4 py-6 lg:px-8">
            <FormWrapper
              className="space-y-5"
              defaultValues={defaultValues}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              onSubmit={onUpdateProfile}
              resolver={zodResolver(customerProfileUpdateSchema)}
            >
              <div className="flex-start-between w-full flex-col lg:flex-row">
                <div className="w-full space-y-5 lg:w-1/2">
                  <UInput
                    name="name"
                    placeholder="Enter your name"
                    label="Name"
                  />

                  <UInput
                    type="email"
                    name="email"
                    label="Email"
                    disabled={true}
                    placeholder="Enter your email"
                  />

                  <UPhoneInput
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Profile Pic Container */}
                <div className="relative w-full lg:w-1/2">
                  {profilePicUrl ? (
                    <div className="relative mx-auto w-max">
                      <CustomAvatar
                        img={profilePicUrl}
                        className="mx-auto block size-56 border border-primary-blue text-xl xl:text-3xl"
                      />

                      {/* show close button if profile pic url is present */}
                      <button
                        className="absolute right-5 top-5 aspect-square rounded-full border border-primary-blue bg-black p-[4px] text-danger"
                        onClick={() => {
                          document.getElementById("profilePicInput").value =
                            null;
                          setProfilePicInput(null);
                          setProfilePicUrl(null);
                        }}
                      >
                        <X size={18} strokeWidth="3px" />
                      </button>
                    </div>
                  ) : (
                    <div className="group relative space-y-4">
                      <CustomAvatar
                        img={profile?.profile}
                        name={profile?.name}
                        className="mx-auto block size-56 text-xl xl:text-3xl"
                      />

                      {!profilePicInput && (
                        <div>
                          <button
                            type="button"
                            size="lg"
                            className="mx-auto block rounded-full border-2 border-primary-blue px-8 py-1.5 font-semibold text-primary-blue"
                            onClick={() =>
                              document.getElementById("profilePicInput").click()
                            }
                          >
                            Upload Image
                          </button>
                          <p className="mt-2 text-center text-muted">
                            Image size should be less than 5MB.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    id="profilePicInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

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
                <UInput name={"address"} disabled={true} value={address} />
              </div>

              <UUpload
                name="banner"
                label="Upload Profile Banner (Optional)"
                maxFileCount={1}
                maxSize={5}
              />

              <Button
                variant="blue"
                size="lg"
                className="rounded-full"
                loading={isUpdating}
                loadingText="Saving..."
              >
                Save Changes
              </Button>
            </FormWrapper>
          </div>
        )}
      </section>

      {/* Change Password */}
      <section className="rounded-lg border bg-white text-black shadow">
        <h4 className="border-b border-b-gray-300 p-4 text-2xl font-semibold">
          Change Password
        </h4>

        <FormWrapper
          onSubmit={onChangePassword}
          className="space-y-5 px-8 py-6"
          resolver={zodResolver(authValidationSchema.resetPasswordSchema)}
        >
          <UInput
            type="password"
            name="oldPassword"
            label="Current Password"
            placeholder="***********"
            showPassword={showOldPass}
            setShowPassword={setShowOldPass}
          />

          <UInput
            type="password"
            name="newPassword"
            label="New Password"
            placeholder="***********"
            showPassword={showNewPass}
            setShowPassword={setShowNewPass}
          />

          <UInput
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="***********"
            showPassword={showConfirmPass}
            setShowPassword={setShowConfirmPass}
          />

          <Button
            type="submit"
            variant="blue"
            size="lg"
            className="rounded-full"
            loading={isPasswordChanging}
          >
            Change Password
          </Button>
        </FormWrapper>
      </section>
    </div>
  );
}
