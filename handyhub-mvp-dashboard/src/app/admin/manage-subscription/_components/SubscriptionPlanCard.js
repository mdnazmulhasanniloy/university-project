import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import { Badge, Button } from "antd";
import { Trash2 } from "lucide-react";
import { Edit } from "lucide-react";

export default function SubscriptionPlanCard({ data, setShowEditPlanModal, handelToDelete,  handelToUpdatePackage }) {
 
  // Most popular card
  if (data?.isHighlighted) {
    return (
      <div className="rounded-3xl border border-gray-300 bg-foundation-accent-800 p-7 text-white font-medium flex flex-col justify-between">
        <div>
          <div className="space-y-4">
            <div className="flex-center-between">
              <h4 className="text-2xl font-semibold">{data?.title} Plan</h4>
              <Badge className="rounded-full bg-gradient-to-br from-[#cbf9f2] to-foundation-accent-400 text-base font-semibold text-black !p-2">
                {data?.tag}
              </Badge>
            </div>

            <h1 className="text-5xl font-semibold">
              ${data?.price}{" "}
              <span className="text-xl font-medium text-white/80">
                /{data?.durationDay}d
              </span>
            </h1>

            <p className="font-medium text-white/75">{data?.shortTItle}</p>
          </div>

          <div className="my-4 h-[1px] w-full border-b border-dashed"></div>

          <p className="text-lg">{data?.shortDescription}</p>
        </div>

        <div className="space-x-4 flex-center">
          <CustomConfirm
            title="Delete Plan"
            description={"Are you sure you want to delete this plan?"}
            onConfirm={() => {handelToDelete(data?._id)}}
          >
            <Button
              className="!font-medium w-1/2 !bg-danger !text-white !border-none"
              icon={<Trash2 size={16} />}
            >
              Delete
            </Button>
          </CustomConfirm>

          <Button
            type="primary"
            className="!font-medium w-1/2"
            icon={<Edit size={16} />}
            onClick={() => {setShowEditPlanModal(true), handelToUpdatePackage(data)}}
          >
            Edit
          </Button>
        </div>
      </div>
    );
  }

  // Normal subscription card
  return (
    <div className="rounded-3xl border border-gray-300 p-7 font-medium flex flex-col justify-between gap-y-4">
      <div>
        <div className="space-y-4">
          <h4 className="text-2xl font-semibold">{data?.title} Plan</h4>
          <h1 className="text-5xl font-semibold">
            ${data?.price}
            <span className="text-xl font-medium text-black/50">
              /{data?.durationDay} days
            </span>
          </h1>
          <p className="font-medium text-black/75">{data?.shortTitle}</p>
        </div>

        <div className="my-4 h-[1px] w-full border-b border-dashed border-b-black"></div>

        <p className="text-lg">{data?.shortDescription}</p>
      </div>

      {/* Edit & Delete Button */}
      <div className="space-x-4 flex-center">
        <CustomConfirm
          title="Delete Plan"
          description={"Are you sure you want to delete this plan?"}
          onConfirm={() => handelToDelete(data?._id)}
        >
          <Button
            className="!font-medium w-1/2 !bg-danger !text-white !border-none"
            icon={<Trash2 size={16} />}
          >
            Delete
          </Button>
        </CustomConfirm>

        <Button
          type="primary"
          className="!font-medium w-1/2"
          icon={<Edit size={16} />}
          onClick={() =>  {setShowEditPlanModal(true), handelToUpdatePackage(data)}}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
