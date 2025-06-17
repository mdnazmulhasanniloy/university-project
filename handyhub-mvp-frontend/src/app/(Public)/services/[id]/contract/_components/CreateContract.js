"use client";

import FormWrapper from "@/components/form-components/FormWrapper";
import UDatePicker from "@/components/form-components/UDatePicker";
import USelect from "@/components/form-components/USelect";
import UTextEditor from "@/components/form-components/UTextEditor";
import UUpload from "@/components/form-components/UUpload";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { selectUser } from "@/redux/features/authSlice";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContractValidations } from "@/schema/contractValidationSchema";
import { useEffect, useState } from "react";
import { useGetProfileQuery } from "@/redux/api/userApi";
import LocationSearch from "../../../_components/LocationSearch";
import { useCreateContractMutation } from "@/redux/api/contractApi";
import { format } from "date-fns";
import { SuccessModal } from "@/utils/customModal";
import { useRouter } from "next/navigation";
import { errorToast } from "@/utils/customToast";
import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";
import { ArrowLeft } from "lucide-react";

const contractTypes = ["Project Based", "Hourly"];

export default function CreateContract({ id }) {
  const userId = useSelector(selectUser)?.userId;
  const router = useRouter();
  const [address, setAddress] = useState("");

  // Get user profile
  const { data: profile } = useGetProfileQuery({}, { skip: !userId });
  const [location, setLocation] = useState(
    // profile?.location ||
    {
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
        servicesPost: id,
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

  return (
    <ResponsiveContainer className="rounded-lg border bg-white !p-8 shadow-lg">
      <button
        onClick={() => router.back()}
        className="flex-center-start gap-2 text-primary-blue/90 hover:text-primary-blue"
      >
        <ArrowLeft size={14} /> Go back to post
      </button>

      <h3 className="mb-3 mt-6 text-2xl font-semibold">Contract Seller</h3>

      <FormWrapper
        onSubmit={onSubmit}
        resolver={zodResolver(ContractValidations.createContractSchema)}
        className="space-y-8"
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

        <UDatePicker
          name="completionDate"
          label="Completion Date"
          disabledBeforeToday={true}
        />

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
    </ResponsiveContainer>
  );
}
