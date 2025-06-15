"use client";

import { Button } from "antd";
import { Edit } from "lucide-react";
import SubscriptionPlanCard from "./SubscriptionPlanCard";
import CreateSubscriptionPlanModal from "./CreateSubscriptionPlanModal";
import { useState } from "react";
import EditSubscriptionPlanModal from "./EditSubscriptionPlanModal";
import {
  useDeletePackageMutation,
  useGetPackagesQuery,
  useUpdatePackageMutation,
} from "@/redux/api/packageApi";
import { ErrorModal, SuccessModal } from "@/utils/modalHook";

export default function SubscriptionsContainer() {
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [DeleteFn, { isLoading: DeleteLoading }] = useDeletePackageMutation();
  const [updatePackage, { isLoading: UpdateLoading }] =
    useUpdatePackageMutation();
  const query = {};
  query["limit"] = 999999999999999;
  query["sort"] = "createdAt";
  const {
    data: packagesRes,
    isLoading,
    isFetching,
  } = useGetPackagesQuery(query);
  const PackagesData = packagesRes?.data?.data || [];

  // delete package
  const handelToDelete = async (id) => {
    try {
      const res = await DeleteFn(id).unwrap();
      SuccessModal(res?.message);
    } catch (error) {
      ErrorModal(error?.message || error?.data?.message);
    }
  };

  //edit package
  const handelToUpdatePackage = async (id, data) => {
    try {
      if (data?.price) data["price"] = Number(data?.price);
      if (data?.durationDay) data["durationDay"] = Number(data?.durationDay);
      const res = await updatePackage({ id, data: data }).unwrap();
      SuccessModal(res?.message);
      if (res.success) {
        setShowEditPlanModal(false);
        setEditData(null);
      }
    } catch (error) {
      ErrorModal(error?.message || error?.data?.message);
    }
  };
  return (
    <div>
      <Button
        type="primary"
        size="large"
        icon={<Edit size={20} />}
        iconPosition="start"
        className="!w-full !py-6"
        onClick={() => setShowCreatePlanModal(true)}
      >
        Create Subscription Plan
      </Button>

      <section className="my-10 grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {PackagesData?.length > 0 &&
          PackagesData?.map((data) => (
            <SubscriptionPlanCard
              key={data?._id}
              data={data}
              handelToUpdatePackage={setEditData}
              handelToDelete={handelToDelete}
              setShowEditPlanModal={setShowEditPlanModal}
            />
          ))}
      </section>

      {/* Create Subscription Plan Modal */}
      <CreateSubscriptionPlanModal
        open={showCreatePlanModal}
        setOpen={setShowCreatePlanModal}
      />

      {/* Edit Subscription Plan Modal */}
      {editData && (
        <EditSubscriptionPlanModal
          open={showEditPlanModal}
          data={editData}
          UpdateLoading={UpdateLoading}
          handelToUpdatePackage={handelToUpdatePackage}
          setOpen={setShowEditPlanModal}
        />
      )}
    </div>
  );
}
