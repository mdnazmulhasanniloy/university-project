"use client";

import ContinueToLoginModal from "@/components/ContinueToLoginModal/ContinueToLoginModal";
import FormWrapper from "@/components/form-components/FormWrapper";
import UDatePicker from "@/components/form-components/UDatePicker";
import UInput from "@/components/form-components/UInput";
import USelect from "@/components/form-components/USelect";
import UTextEditor from "@/components/form-components/UTextEditor";
import UUpload from "@/components/form-components/UUpload";
import ModalWrapper from "@/components/ModalWrapper.js/ModalWrapper";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { selectUser } from "@/redux/features/authSlice";
import { useSelector } from "react-redux";
import ServicePostCreateWarningModal from "./ServicePostCreateWarningModal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContractValidations } from "@/schema/contractValidationSchema";
import { useEffect, useState } from "react";
import { useGetProfileQuery } from "@/redux/api/userApi";
import LocationSearch from "../../_components/LocationSearch";
import { useCreateContractMutation } from "@/redux/api/contractApi";
import { format } from "date-fns";
import { ErrorModal, SuccessModal } from "@/utils/customModal";
import { useRouter } from "next/navigation";
import { errorToast } from "@/utils/customToast";

const contractTypes = ["Project Based", "Hourly"];

export default function ServiceContractModal({ open, setOpen, servicePost }) {
  const userId = useSelector(selectUser)?.userId;
  const router = useRouter();
  const [address, setAddress] = useState("");

  // Get user profile
  const { data: profile } = useGetProfileQuery({}, { skip: !userId });
  const [location, setLocation] = useState(
    profile?.location || {
      type: "Point",
      coordinates: [90.42542154233024, 23.7748129376789],
    },
  );

  const [createContract, { isLoading }] = useCreateContractMutation(
    {},
    { skip: !userId },
  );

  useEffect(() => {
    if (profile?.location) {
      setLocation(profile?.location);
      setAddress(profile?.address);
    }
  }, [profile]);

  const onSubmit = async (data) => {
    if (
      !location?.coordinates ||
      (location?.coordinates?.length > 0 &&
        location?.coordinates[0] === 0 &&
        location?.coordinates[1] === 0)
    ) {
      return alert("Please select a address for the service!!");
    }

    const formData = new FormData();

    if (data.images) {
      data.images?.forEach((img) => {
        formData.append("images", img);
      });
    }

    delete data["images"];

    formData.append(
      "data",
      JSON.stringify({
        servicesPost: servicePost?._id,
        location,
        address,
        completionDate: format(data.completionDate, "yyyy-MM-dd"),
        ...data,
      }),
    );

    try {
      await createContract(formData).unwrap();

      SuccessModal("Contract Requested Successfully!");
      router.push("/customer/dashboard");
    } catch (error) {
      errorToast(error?.message || error?.data?.message);
    }
  };

  if (profile?.role !== "customer") {
    return <ServicePostCreateWarningModal open={open} setOpen={setOpen} />;
  }

  if (!userId) {
    return (
      <ContinueToLoginModal
        open={open}
        setOpen={setOpen}
        text="contract for the service."
      />
    );
  }

  return (
    <ModalWrapper
      title="Contract for service"
      className="2xl:max-w-[50%]"
      open={open}
      setOpen={setOpen}
    >
      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(ContractValidations.createContractSchema)}
        className="space-y-6"
      >
        <UUpload
          name="images"
          maxFileCount={5}
          maxSize={5}
          label="Attach Images"
        />

        <USelect
          name="contractType"
          label="Contract Type"
          selectTrigger="Select a type"
          selectItems={contractTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        />

        <LocationSearch
          defaultValue={profile?.address}
          setLocationSearch={setLocation}
          setPropAddress={setAddress}
          label="Address * (Use mouse arrow keys to select an address)"
          searchInputClassName="rounded-lg border-gray-300 py-5"
        />

        <UDatePicker name="completionDate" label="Completion Date" />

        <UTextEditor
          name="description"
          label="Service Description"
          placeholder="Note: Write a detailed description of the service you need."
        />

        <Button
          variant="blue"
          className="w-full rounded-full py-6"
          loading={isLoading}
          loadingText="Submitting..."
        >
          Request Quote
        </Button>
      </FormWrapper>
    </ModalWrapper>
  );
}
