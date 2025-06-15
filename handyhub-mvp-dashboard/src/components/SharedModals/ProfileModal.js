"use client";

import { Modal } from "antd";
import userImage from "@/assets/images/user-avatar-lg.png";
import Image from "next/image";
import { Tag } from "antd";

export default function ProfileModal({
  open,
  setOpen,
  modalData,
  setModalData,
}) {
  return (
    <Modal
      centered
      open={open}
      setOpen={setOpen}
      footer={null}
      onCancel={() => {
        setOpen(false);
        setModalData(null);
      }}
    >
      <div className="flex flex-col items-center gap-4 rounded-lg bg-primary-blue py-4">
        {modalData?.profile ? (
          <Image
            src={modalData?.profile}
            alt="user image"
            height={2400}
            width={2400}
            className="aspect-square h-auto w-[30%] rounded-full"
          />
        ) : (
          <div className="font-500 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white">
            <p className="text-2xl">
              {modalData?.email?.slice(0, 2)?.toUpperCase()}
            </p>
          </div>
        )}

        <h4 className="text-3xl font-bold text-white">
          {modalData?.name ? modalData?.name : "N/A"}
        </h4>
      </div>

      <div className="grid grid-cols-1 gap-7 px-12 py-8 md:grid-cols-2">
        <div className="text-black">
          <h5 className="font-bold">Name</h5>
          <p className="font-dmSans text-base">
            {modalData?.name ? modalData?.name : "N/A"}
          </p>
        </div>
        <div className="text-black">
          <h5 className="font-bold">Email</h5>
          <p className="font-dmSans text-base">
            {modalData?.email ? modalData?.email : "N/A"}
          </p>
        </div>
        <div className="text-black">
          <h5 className="font-bold">Contact</h5>
          <p className="font-dmSans text-base">
            {modalData?.phoneNumber ? modalData?.phoneNumber : "N/A"}
          </p>
        </div>
        <div className="text-black">
          <h5 className="font-bold">Account Type</h5>
          <p className="font-dmSans">
            <Tag
              color={
                modalData?.role === "customer"
                  ? "blue"
                  : modalData?.role === "seller"
                    ? "cyan"
                    : "orange-inverse"
              }
              className="!mt-1 !text-sm !font-semibold capitalize"
            >
              {modalData?.role === "admin" || modalData?.role === "customer"
                ? modalData?.role
                : "Service Provider"}
            </Tag>
          </p>
        </div>
      </div>
    </Modal>
  );
}
