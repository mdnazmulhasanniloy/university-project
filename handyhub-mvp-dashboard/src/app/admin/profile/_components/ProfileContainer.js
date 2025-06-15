"use client";

import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { Tabs } from "antd";
import { ConfigProvider } from "antd";
import ChangePassForm from "./ChangePassForm";
import EditProfileForm from "./EditProfileForm";
import { useRef, useState } from "react";
import { useGetProfileQuery } from "@/redux/api/userApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";
import { useUpdateProfileMutation } from "@/redux/api/authApi";
import { X } from "lucide-react";

const { TabPane } = Tabs;

export default function ProfileContainer() {
  const { data: profileRes, refetch } = useGetProfileQuery();
  const [updateProfileFn, { isLoading }] = useUpdateProfileMutation();
  const ref = useRef(null);
  const [profile, setProfile] = useState(null);
  const profileData = profileRes?.data || {};
  const handleButtonClick = () => {
    ref.current?.click();
  };
  const handelToUpdateProfile = async (data) => {
    try {
      const formData = new FormData();
      if (profile) {
        formData.append("profile", profile);
      }

      formData.append("data", JSON.stringify(data));
      const res = await updateProfileFn(formData).unwrap();
      SuccessModal("Profile updated successfully");

      if (res.success) {
        refetch();
      }
    } catch (err) {
      ErrorModal(err?.message || err?.data?.message);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1b71a7",
        },
      }}
    >
      <div className="mx-auto w-full px-5 lg:w-3/4 lg:px-0 2xl:w-1/2">
        {/* Profile pic */}
        <section className="flex-center gap-x-3">
          <div className="relative w-max">
            {((profile && URL?.createObjectURL(profile)) ||
              profileData?.profile) && (
              <Image
                src={
                  (profile && URL?.createObjectURL(profile)) ||
                  profileData?.profile
                }
                alt="Admin avatar"
                width={1200}
                height={1200}
                className="border-primary-green aspect-square h-auto w-[160px] rounded-full border-2 p-1"
              />
            )}

            {/* Remove image button */}
            {profile && URL?.createObjectURL(profile) && (
              <button
                className="absolute right-3 top-3 aspect-square rounded-full bg-primary-black stroke-2 p-0.5 text-danger"
                onClick={() => {
                  setProfile(null);
                  ref.current.value = null;
                }}
              >
                <X className="size-5" />
              </button>
            )}

            {/* Edit button */}
            <button
              onClick={handleButtonClick}
              className="flex-center absolute bottom-2 right-2 aspect-square rounded-full bg-primary-orange p-2 text-white/95"
            >
              <ImagePlus size={20} />
            </button>

            <input
              ref={ref}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProfile(file);
                }
              }}
              type="file"
              className="hidden h-full w-full"
            />
          </div>

          <div>
            <h3 className="text-3xl font-semibold">{profileData?.name}</h3>
            <p className="mt-1 text-lg font-medium text-primary-blue">
              {profileData?.role === "admin" && "Administrator"}
            </p>
          </div>
        </section>

        {/* Profile Information Forms */}
        <section className="my-16">
          <Tabs defaultActiveKey="editProfile" centered>
            <TabPane tab="Edit Profile" key="editProfile">
              <EditProfileForm
                handelToUpdateProfile={handelToUpdateProfile}
                profileData={profileData}
                isLoading={isLoading}
              />
            </TabPane>

            <TabPane tab="Change Password" key="changePassword">
              <ChangePassForm />
            </TabPane>
          </Tabs>
        </section>
      </div>
    </ConfigProvider>
  );
}
